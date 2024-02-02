import { DeepgramClient, SyncPrerecordedResponse } from "@deepgram/sdk";

import { DeepgramModule } from "../../../../../core/modules/Deepgram";
import { TimedSentence, TimedText } from "../../../../videoTypes";
import { TimestampsGeneratorStrategy } from "./TimestampsGeneratorStrategy";

export class DeepgramTimestampsGeneratorStrategy implements TimestampsGeneratorStrategy {
    deepgramModule: DeepgramClient;

    constructor() {
        this.deepgramModule = DeepgramModule.getModule();
    }

    async generateTimestampsBasedOnAudio(input: Buffer) {
        console.log("Create the timestamps with Deepgram");
        const result = await this.deepgramModule.listen.prerecorded.transcribeFile(input, {
            model: "nova-2",
            language: "en",
            smart_format: true,
            punctuate: true,
            utterances: true,
            utt_split: 1.2,
        });

        console.log(JSON.stringify(result.result), "Deepgram transcribe result");

        console.log("Timestamps created with Deepgram");
        return this.mapDataToTimedText(result.result);
    }

    mapDataToTimedText(data: SyncPrerecordedResponse | null) {
        if (!data) {
            return;
        }

        const alternatives = data.results.channels[0].alternatives[0];

        const duration = alternatives.words[alternatives.words.length - 1].end;

        const subtitles = alternatives.words.map(({ punctuated_word, word, start, end }) => ({
            word: punctuated_word || word,
            start,
            end,
        })) as TimedText[];

        const sentences: TimedSentence[] = [];

        alternatives.paragraphs?.paragraphs.forEach((x) => {
            x.sentences.forEach((s) => {
                sentences.push({
                    sentence: s.text,
                    start: s.start,
                    end: s.end,
                });
            });
        });

        return {
            duration,
            subtitles,
            sentences,
        };
    }
}