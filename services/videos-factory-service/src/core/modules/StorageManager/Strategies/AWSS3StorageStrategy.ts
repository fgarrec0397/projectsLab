import AWS, { config } from "aws-sdk";
import fs from "fs";
import path from "path";

class S3StorageManager {
    private s3: AWS.S3;

    private bucketName: string;

    constructor(bucketName: string) {
        config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });

        this.s3 = new AWS.S3();
        this.bucketName = bucketName;
    }

    async listFiles(): Promise<AWS.S3.ListObjectsV2Output> {
        try {
            const params = {
                Bucket: this.bucketName,
            };
            return await this.s3.listObjectsV2(params).promise();
        } catch (error) {
            throw new Error("Error listing files: " + error);
        }
    }

    async uploadFile(fileName: string, filePath: string): Promise<AWS.S3.ManagedUpload.SendData> {
        try {
            const fileContent = fs.readFileSync(filePath);
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

    async downloadFile(fileName: string, destinationPath: string): Promise<void> {
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
}

export default S3StorageManager;
