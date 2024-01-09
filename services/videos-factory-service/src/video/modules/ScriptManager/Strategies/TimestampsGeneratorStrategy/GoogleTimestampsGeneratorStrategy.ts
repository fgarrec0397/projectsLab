import { SpeechClient } from "@google-cloud/speech";
import { google } from "@google-cloud/speech/build/protos/protos";

import { GoogleCloudSpeechModule } from "../../../../../core/modules/GoogleCloudSpeech";
import { TimedText } from "../../../../utils/mappers/mapSubtitles";
import { nanosToSeconds } from "../../../../utils/nanosToSeconds";
import { TimestampsGeneratorStrategy } from "./TimestampsGeneratorStrategy";

export class GoogleTimestampsGeneratorStrategy implements TimestampsGeneratorStrategy {
    googleSpeechModule: SpeechClient;

    constructor() {
        this.googleSpeechModule = GoogleCloudSpeechModule.getModule();
    }

    async generateTimestampsBasedOnAudio(input: Buffer) {
        console.log("Create the timestamps with google");
        const result = await this.googleSpeechModule.recognize({
            audio: { content: input },
            config: {
                encoding: "MP3",
                sampleRateHertz: 16000,
                languageCode: "en-US",
                enableWordTimeOffsets: true,
                model: "latest_long",
                useEnhanced: true,
            },
        });

        return this.mapGoogleSpeechDataToSubtitles(result?.[0]);
    }

    private mapGoogleSpeechDataToSubtitles(data?: google.cloud.speech.v1.IRecognizeResponse) {
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
