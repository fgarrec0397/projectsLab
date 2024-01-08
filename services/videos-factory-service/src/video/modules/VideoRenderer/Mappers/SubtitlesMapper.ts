import { google } from "@google-cloud/speech/build/protos/protos";

import { TimedText } from "../../../utils/mappers/mapSubtitles";
import { nanosToSeconds } from "../../../utils/nanosToSeconds";

export class SubtitlesMapper {
    mapGoogleSpeechDataToSubtitles(data?: google.cloud.speech.v1.IRecognizeResponse) {
        console.log(JSON.stringify(data), "data");

        const newData = data?.results
            ?.flatMap(({ alternatives }) => {
                if (!alternatives?.[0].words) {
                    return null;
                }

                return alternatives[0].words.map(({ word, startTime, endTime }) => ({
                    word,
                    start: this.mapGoogleDurationToSeconds(startTime),
                    end: this.mapGoogleDurationToSeconds(endTime),
                }));
            })
            .filter((x) => x !== undefined || x !== null) as TimedText[];

        return newData || [];
    }

    private mapGoogleDurationToSeconds(duration: google.protobuf.IDuration | null | undefined) {
        if (
            !duration ||
            duration.nanos === undefined ||
            duration.nanos === null ||
            duration.seconds === undefined ||
            duration.seconds === null
        ) {
            return 0;
        }

        const nanosSeconds = nanosToSeconds(duration.nanos);

        return String(nanosSeconds + Number(duration.seconds));
    }
}
