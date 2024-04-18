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
    "Queued" = "queued",
    "Failed" = "failed",
}

export type IVideo = {
    id: string;
    name: string;
    location: string;
    age: number[];
    gender: string;
    language: string;
    interests: string | undefined;
    challenges: string | undefined;
    topic: string;
    specificityLevel: string;
    structureType: string;
    pace: string;
    moreSpecificities: string | undefined;
    files?: string[];
    status: VideoStatus;
    duration?: number;
    videoKey?: string;
    videoUrl?: string;
    thumbnailKey?: string;
    thumbnailUrl?: string;
    createdAt: number;
    updatedAt: number;
    failedReason?: string;
};

export type IVideoDraft = Partial<IVideo>;

export type IFormVideo = Omit<
    IVideo,
    | "id"
    | "documentId"
    | "status"
    | "thumbnail"
    | "createdAt"
    | "updatedAt"
    | "failedReason"
    | "duration"
    | "videoKey"
    | "videoUrl"
    | "thumbnailKey"
    | "thumbnailUrl"
>;
