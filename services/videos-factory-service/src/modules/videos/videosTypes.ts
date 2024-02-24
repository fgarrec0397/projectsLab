import { BaseResult } from "src/common/database/databaseTypes";

export type IVideo = BaseResult & {
    id: string;
    name: string;
    location: string;
    age: [number, number];
    gender: string;
    language: string;
    interests?: string;
    chanllenges?: undefined;
    contentType: string;
    specificityLevel: string;
    structureType: string;
    pace: string;
    moreSpecificities?: string;
    status: "draft" | "pending" | "rendering" | "rendered" | "publishing" | "published";
};

export type IVideoDraft = Partial<IVideo>;
