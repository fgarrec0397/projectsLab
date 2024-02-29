import { BaseResult } from "src/common/database/databaseTypes";

export type StructureType = "quickTips" | "storytelling" | "vlog" | "tops";

export type SpecificityLevel = "broader" | "specific";

export type Gender = "male" | "female" | "all";

export type Pace = "slow" | "fast" | "mix";

export enum VideoStatus {
    "Draft" = "draft",
    "Pending" = "pending",
    "Rendering" = "rendering",
    "Rendered" = "rendered",
    "Publishing" = "publishing",
    "Published" = "published",
}

export type IVideo = BaseResult & {
    id: string;
    name: string;
    location: string;
    age: [number, number];
    gender: Gender;
    language: string;
    interests?: string;
    challenges?: undefined;
    topic: string;
    specificityLevel: SpecificityLevel;
    structureType: StructureType;
    pace: Pace;
    moreSpecificities?: string;
    files: string[];
    status: VideoStatus;
};

export type IVideoDraft = Partial<IVideo>;
