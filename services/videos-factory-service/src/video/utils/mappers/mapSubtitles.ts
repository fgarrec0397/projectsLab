import { google } from "@google-cloud/speech/build/protos/protos";

export type Subtitle = {
    word: string | null | undefined;
    start?: number;
    end?: number;
};

export const mapSubtitles = (data?: google.cloud.speech.v1.IRecognizeResponse): Subtitle[] => {
    const newData = data?.results
        ?.flatMap(({ alternatives }) => {
            if (!alternatives?.[0].words) {
                return null;
            }

            return alternatives[0].words.map(({ word, startTime, endTime }) => ({
                word,
                start: startTime,
                end: endTime,
            }));
        })
        .filter((x) => x !== undefined || x !== null) as Subtitle[];

    return newData || [];
};
