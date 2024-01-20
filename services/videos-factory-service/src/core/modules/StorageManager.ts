import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";

import { FileSystem } from "./FileSystem";

type OAuth2JSON = {
    web: {
        client_id: string;
        client_secret: string;
        redirect_uris: string[];
    };
};

class StorageManager {
    private drive: drive_v3.Drive;

    private folderId: string = "11SxScRBf59VjL6GMJMPH-np2saa68i4j";

    constructor() {
        const keys = FileSystem.loadJson<OAuth2JSON>("./credentials/oauth2.keys.json");

        const oauth2Client = new OAuth2Client(
            keys?.web.client_id,
            keys?.web.client_secret,
            keys?.web.redirect_uris[0]
        );

        this.drive = google.drive({ version: "v3", auth: oauth2Client });
    }

    async listFiles(): Promise<drive_v3.Schema$FileList> {
        try {
            const response = await this.drive.files.list({
                q: `'${this.folderId}' in parents`,
            });
            return response.data;
        } catch (error) {
            throw new Error("Error listing files: " + error);
        }
    }

    async uploadFile(
        fileName: string,
        filePath: string,
        mimeType: string
    ): Promise<drive_v3.Schema$File> {
        const fileMetadata = {
            name: fileName,
            parents: [this.folderId],
        };

        const media = {
            mimeType,
            body: FileSystem.createReadStream(filePath),
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

    // Download a file from the specified folder in the drive
    async downloadFile(fileId: string, destinationPath: string): Promise<void> {
        try {
            const file = await this.drive.files.get({ fileId, fields: "parents" });

            if (!file.data.parents || !file.data.parents.includes(this.folderId)) {
                throw new Error("File is not in the specified folder.");
            }

            const response = await this.drive.files.get(
                { fileId, alt: "media" },
                { responseType: "stream" }
            );

            return await new Promise((resolve, reject) => {
                const dest = FileSystem.createWriteStream(destinationPath);
                response.data
                    .on("end", () => resolve())
                    .on("error", (err) => reject("Error downloading file: " + err))
                    .pipe(dest);
            });
        } catch (error) {
            throw new Error("Error downloading file: " + error);
        }
    }
}

const storageManager = new StorageManager();

export default storageManager;
