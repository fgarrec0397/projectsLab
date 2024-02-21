import { Injectable } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

@Injectable()
export class VideosService {
    constructor(@InjectDatabase() private readonly database: DatabaseConfig) {}

    async getLastVideoDraft(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const lastVideoDraft = await this.database.findWithQuery(videoCollectionPath, [
            { field: "isDraft", operator: "==", value: true },
        ]);

        if (lastVideoDraft.length) {
            return lastVideoDraft[0];
        }

        const defaultVideoDraft = {
            id: uidGenerator(),
            name: "Your new awesome video",
            location: "",
            age: [18, 36],
            gender: "all",
            language: "en-US",
            interests: undefined,
            chanllenges: undefined,
            contentType: "",
            specificityLevel: "broader audience",
            structureType: "quick tips",
            pace: "mix",
            moreSpecificities: undefined,
            isDraft: true,
        };

        return this.database.create(videoCollectionPath, defaultVideoDraft);
    }
}
