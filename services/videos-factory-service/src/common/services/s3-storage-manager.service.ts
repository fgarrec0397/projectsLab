import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AWS, { config } from "aws-sdk";
import fs from "fs";
import path from "path";

@Injectable()
export class S3StorageManager {
    private s3: AWS.S3;

    private bucketName: string;

    constructor(private configService: ConfigService) {
        config.update({
            accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
            secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
            region: this.configService.get<string>("AWS_REGION"),
        });

        this.s3 = new AWS.S3();
        this.bucketName = this.configService.get<string>("AWS_BUCKET_NAME", "");
    }

    extractFileName(key: string | undefined) {
        if (!key) {
            return;
        }

        const baseName = key.split("/").pop() || key;

        return baseName;
    }

    getFileExtension(key: string | undefined) {
        if (!key) {
            return;
        }

        const extensionMatch = key?.match(/\.[0-9a-z]+$/i);

        return extensionMatch ? extensionMatch[0] : null;
    }

    async listFiles(folderPath?: string): Promise<AWS.S3.ObjectList> {
        try {
            const params: AWS.S3.ListObjectsV2Request = {
                Bucket: this.bucketName,
                Prefix: folderPath ? `${folderPath}/` : undefined,
            };
            const response = await this.s3.listObjectsV2(params).promise();

            return response.Contents || [];
        } catch (error) {
            throw new Error("Error listing files: " + error);
        }
    }

    async uploadFile(fileName: string, destinationPath: string) {
        try {
            const fileContent = fs.readFileSync(destinationPath);
            const params = {
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileContent,
            };
            return await this.s3.upload(params).promise();
        } catch (error) {
            throw new Error("Error uploading file: " + error);
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

    getSignedFileUrl(key: string | undefined, expirySeconds: number = 3600) {
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
}

export default S3StorageManager;
