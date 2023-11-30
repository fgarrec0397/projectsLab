import { google } from "@google-cloud/speech/build/protos/protos";

type Result =
    | {
          word: string | null | undefined;
          startTime: google.protobuf.IDuration | null | undefined;
          endTime: google.protobuf.IDuration | null | undefined;
      }[]
    | null;

export const mapSubtitles = (data?: google.cloud.speech.v1.IRecognizeResponse): Result[] => {
    const newData = data?.results?.map(({ alternatives }) => {
        if (!alternatives?.[0].words) {
            return null;
        }

        return alternatives[0].words.map(({ word, startTime, endTime }) => ({
            word,
            startTime,
            endTime,
        }));
    });

    return newData || [];
};
