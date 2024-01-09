import { TimedText } from "../../../../utils/mappers/mapSubtitles";

export interface TimestampsGeneratorStrategy {
    generateTimestampsBasedOnAudio(input: Buffer): Promise<TimedText[]>;
}
