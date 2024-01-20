import { DeepgramClient, SyncPrerecordedResponse } from "@deepgram/sdk";

import { DeepgramModule } from "../../../../../core/modules/Deepgram";
import { TimedText } from "../../../../videoTypes";
import { TimestampsGeneratorStrategy } from "./TimestampsGeneratorStrategy";

export class DeepgramTimestampsGeneratorStrategy implements TimestampsGeneratorStrategy {
    deepgramModule: DeepgramClient;

    constructor() {
        this.deepgramModule = DeepgramModule.getModule();
    }

    async generateTimestampsBasedOnAudio(input: Buffer) {
        console.log("Create the timestamps with Deepgram");
        const result = await this.deepgramModule.listen.prerecorded.transcribeFile(input, {
            smart_format: true,
        });

        console.log(JSON.stringify(result.result), "Deepgram transcribe result");

        console.log("Timestamps created with Deepgram");
        return this.mapDataToTimedText(result.result);
    }

    mapDataToTimedText(data: SyncPrerecordedResponse | null) {
        if (!data) {
            return [];
        }

        return data.results.channels[0].alternatives[0].words.map(
            ({ punctuated_word, word, start, end }) => ({
                word: punctuated_word || word,
                start,
                end,
            })
        ) as TimedText[];
    }
}
