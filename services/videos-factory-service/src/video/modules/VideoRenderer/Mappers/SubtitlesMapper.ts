import { google } from "@google-cloud/speech/build/protos/protos";

import { TimedText } from "../../../utils/mappers/mapSubtitles";
import { nanosToSeconds } from "../../../utils/nanosToSeconds";

export type TranscribeTranscript = {
    jobName: string;
    accountId: string;
    status: string;
    results: {
        transcripts: Array<{
            transcript: string;
        }>;
        items: Array<{
            type: string;
            alternatives: Array<{
                confidence: string;
                content: string;
            }>;
            start_time?: string;
            end_time?: string;
        }>;
    };
};

type TranscriptResult = {
    transcript: string;
    confidence: number;
    words: Word[];
};

type Word = {
    word: string;
    start: number;
    end: number;
    confidence: number;
    punctuated_word: string;
};

type Channel = {
    alternatives: TranscriptResult[];
};

type Results = {
    channels: Channel[];
};

type ModelInfoDetails = {
    name: string;
    version: string;
    arch: string;
};

type ModelInfo = {
    [key: string]: ModelInfoDetails;
};

type Metadata = {
    transaction_key: string;
    request_id: string;
    sha256: string;
    created: string;
    duration: number;
    channels: number;
    models: string[];
    model_info: ModelInfo;
};

type JsonResponse = {
    metadata: Metadata;
    results: Results;
};

export class SubtitlesMapper {
    mapDeepgramToTimedText(data: JsonResponse) {
        return data.results.channels[0].alternatives[0].words.map(({ word, start, end }) => ({
            word,
            start,
            end,
        })) as TimedText[];
    }

    mapAwsTranscribeToTimedText(data?: TranscribeTranscript) {
        return data?.results.items
            .map((x) => ({
                word: x.alternatives[0].content,
                start: x.start_time,
                end: x.end_time,
            }))
            .filter((x) => !x.word.match(/\.|\?|\,/gm)) as TimedText[];
    }

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
