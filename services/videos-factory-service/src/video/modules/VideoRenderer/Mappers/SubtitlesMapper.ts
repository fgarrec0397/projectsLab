import { google } from "@google-cloud/speech/build/protos/protos";

import { TimedText } from "../../../utils/mappers/mapSubtitles";
import { nanosToSeconds } from "../../../utils/nanosToSeconds";

export class SubtitlesMapper {
    mapGoogleSpeechDataToSubtitles(data?: google.cloud.speech.v1.IRecognizeResponse) {
        const newData = data?.results
            ?.flatMap(({ alternatives }) => {
                if (!alternatives?.[0].words) {
                    return null;
                }

                return alternatives[0].words.map(({ word, startTime, endTime }) => ({
                    word,
                    start: nanosToSeconds(startTime!.nanos!),
                    end: nanosToSeconds(endTime!.nanos!),
                }));
            })
            .filter((x) => x !== undefined || x !== null) as TimedText[];

        return newData || [];
    }
}
