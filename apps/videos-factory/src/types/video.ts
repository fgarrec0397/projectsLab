export type IVideo = {
    id: string;
    documentId: string;
    name: string;
    location: string;
    age: number[];
    gender: string;
    language: string;
    interests?: string;
    chanllenges?: string;
    contentType: string;
    specificityLevel: string;
    structureType: string;
    pace: string;
    moreSpecificities?: string;
    files: string[];
};

export type IVideoDraft = Partial<IVideo>;

export type IFormVideo = Omit<IVideo, "id" | "documentId">;
