import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";

class GoogleDriveClient {
    private drive: drive_v3.Drive;

    constructor(auth: OAuth2Client) {
        this.drive = google.drive({ version: "v3", auth });
    }

    // List files in the drive
    async listFiles(): Promise<drive_v3.Schema$FileList> {
        try {
            const response = await this.drive.files.list({});
            return response.data;
        } catch (error) {
            throw new Error("Error listing files: " + error);
        }
    }

    // Upload a file to the drive
    async uploadFile(
        fileName: string,
        filePath: string,
        mimeType: string
    ): Promise<drive_v3.Schema$File> {
        const fileMetadata = {
            name: fileName,
            // Add more metadata if needed
        };
        const media = {
            mimeType,
            body: fs.createReadStream(filePath),
        };

        try {
            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id",
            });
            return response.data;
        } catch (error) {
            throw new Error("Error uploading file: " + error);
        }
    }

    // Download a file from the drive
    async downloadFile(fileId: string, destinationPath: string): Promise<void> {
        try {
            const response = await this.drive.files.get(
                { fileId, alt: "media" },
                { responseType: "stream" }
            );
            return await new Promise((resolve, reject) => {
                const dest = fs.createWriteStream(destinationPath);
                response.data
                    .on("end", () => resolve())
                    .on("error", (err) => reject("Error downloading file: " + err))
                    .pipe(dest);
            });
        } catch (error) {
            throw new Error("Error downloading file: " + error);
        }
    }

    // Add more methods for other Google Drive operations
}

export default GoogleDriveClient;
