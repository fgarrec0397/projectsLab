import { BaseResult } from "src/common/database/databaseTypes";

import { BaseElement } from "./components/VideoRenderer/Entities/BaseElement";

export type TimedText = {
    word: string | null | undefined;
    start: number | undefined;
    end: number | undefined;
};

export type TimedSentence = {
    sentence: string | null | undefined;
    start: number | undefined;
    end: number | undefined;
};

export type Template = {
    duration?: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    elements: BaseElement[];
};

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
};
export type IVideoDraft = Partial<IVideo>;
