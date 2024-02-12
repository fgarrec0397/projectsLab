import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AWS, { config } from "aws-sdk";
import { CommonPrefix } from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";

import { StorageStrategy } from "../storage-manager";

type S3StorageManagerTypes = {
    getFile: AWS.S3.GetObjectOutput;
    getFiles: AWS.S3.ObjectList;
    uploadFile: AWS.S3.ManagedUpload.SendData;
    downloadFile: void;
};

@Injectable()
export class S3StorageManager implements StorageStrategy<S3StorageManagerTypes> {
    private s3: AWS.S3;

    private bucketName: string;

    constructor(private readonly configService: ConfigService) {}

    init() {
        config.update({
            accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
            secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
            region: this.configService.get<string>("AWS_REGION"),
        });

        this.s3 = new AWS.S3();
        this.bucketName = this.configService.get<string>("AWS_BUCKET_NAME", "");
    }

    getBaseUrl() {
        return `https://${this.bucketName}.s3.amazonaws.com`;
    }

    getFileName(key: string | undefined) {
        if (!key) {
            return;
        }

        const pathArray = key.split("/");

        let baseName = pathArray.pop();
        const isFolder = baseName === "";

        if (isFolder) {
            baseName = pathArray.pop();
        }

        return baseName || key;
    }

    getFileExtension(key: string | undefined) {
        if (!key) {
            return;
        }

        const extensionMatch = key?.match(/\.[0-9a-z]+$/i);

        return extensionMatch ? extensionMatch[0] : null;
    }

    getFileUrl(key: string | undefined) {
        const expirySeconds: number = 3600;

        if (!key) {
            return;
        }

        const params = {
            Bucket: this.bucketName,
            Key: key,
            Expires: expirySeconds,
        };
        return this.s3.getSignedUrl("getObject", params);
    }

    async getFile(key: string): Promise<AWS.S3.GetObjectOutput> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
            };
            const data = await this.s3.getObject(params).promise();
            return data;
        } catch (error) {
            throw new Error(`Error retrieving file with key ${key}: ${error}`);
        }
    }

    async getFiles(folderPath?: string): Promise<AWS.S3.ObjectList> {
        const regex = /\\\\?/gm;
        try {
            const params: AWS.S3.ListObjectsV2Request = {
                Bucket: this.bucketName,
                Prefix: folderPath ? `${folderPath.replaceAll(regex, "/")}/` : undefined,
                Delimiter: "/",
            };

            const response = await this.s3.listObjectsV2(params).promise();
            const files = response.Contents?.filter((item) => !item.Key.endsWith("/")) ?? [];
            const folders = response.CommonPrefixes ?? [];

            const objectFolders = folders.map(this.commonPrefixToObject);
            const objects = [...objectFolders, ...files];

            return objects || [];
        } catch (error) {
            throw new Error("Error listing files: " + error);
        }
    }

    async uploadFile(file: Express.Multer.File, fileName: string) {
        try {
            return await this.s3
                .upload({
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: file.buffer,
                })
                .promise();
        } catch (error) {
            throw new Error("Error uploading file: " + error);
        }
    }

    async createFolder(folderName: string) {
        const folderKey = folderName.endsWith("/") ? folderName : `${folderName}/`;

        try {
            return await this.s3.putObject({ Bucket: this.bucketName, Key: folderKey }).promise();
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    }

    async downloadFile(fileName: string, destinationPath: string) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileName,
            };
            const data = await this.s3.getObject(params).promise();
            fs.writeFileSync(path.join(destinationPath, fileName), data.Body as Buffer);
        } catch (error) {
            throw new Error("Error downloading file: " + error);
        }
    }

    private commonPrefixToObject = (commonPrefix: CommonPrefix): AWS.S3.Object => {
        return {
            Key: commonPrefix.Prefix,
        };
    };
}

export default S3StorageManager;
