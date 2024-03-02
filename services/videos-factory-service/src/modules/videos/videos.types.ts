export type StructureType = "quickTips" | "storytelling" | "vlog" | "tops";

export type SpecificityLevel = "broader" | "specific";

export type Gender = "male" | "female" | "all";

export type Pace = "slow" | "fast" | "mix";

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
    createdAt: Date;
    updatedAt: Date;
};

export type IVideoDraft = Omit<Partial<IVideo>, "id"> & {
    id: string;
};
