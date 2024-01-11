import { DeepgramClient, DeepgramResponse, SyncPrerecordedResponse } from "@deepgram/sdk";

import { DeepgramModule } from "../../../../../core/modules/Deepgram";
import { TimedText } from "../../../../utils/mappers/mapSubtitles";
import { TimestampsGeneratorStrategy } from "./TimestampsGeneratorStrategy";

export class DeepgramTimestampsGeneratorStrategy implements TimestampsGeneratorStrategy {
    deepgramModule: DeepgramClient;

    constructor() {
        this.deepgramModule = DeepgramModule.getModule();
    }

    async generateTimestampsBasedOnAudio(input: Buffer) {
        console.log("Create the timestamps with Deepgram");
        const result = await this.deepgramModule.listen.prerecorded.transcribeFile(input);

        return this.mapDataToTimedText(result);
    }

    mapDataToTimedText(data: DeepgramResponse<SyncPrerecordedResponse>) {
        return data.result?.results.channels[0].alternatives[0].words.map(
            ({ word, start, end }) => ({
                word,
                start,
                end,
            })
        ) as TimedText[];
    }
}
