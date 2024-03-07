import { ServerTimestamp } from "./date";

export enum VideoStatus {
    "Draft" = "draft",
    "GeneratingScript" = "generatingScript",
    "ScriptGenerated" = "scriptGenerated",
    "GeneratingTemplate" = "generatingTemplate",
    "TemplateGenerated" = "templateGenerated",
    "Rendering" = "rendering",
    "Rendered" = "rendered",
    "Publishing" = "publishing",
    "Published" = "published",
}

export type IVideo = {
    id: string;
    name: string;
    location: string;
    age: number[];
    gender: string;
    language: string;
    interests?: string;
    challenges?: string;
    topic: string;
    specificityLevel: string;
    structureType: string;
    pace: string;
    moreSpecificities?: string;
    files: string[];
    status: VideoStatus;
    duration?: number;
    videoKey?: string;
    videoUrl?: string;
    thumbnail?: string;
    createdAt: ServerTimestamp;
    updatedAt: ServerTimestamp;
};

export type IVideoDraft = Partial<IVideo>;

export type IFormVideo = Omit<
    IVideo,
    "id" | "documentId" | "status" | "thumbnail" | "createdAt" | "updatedAt"
>;
