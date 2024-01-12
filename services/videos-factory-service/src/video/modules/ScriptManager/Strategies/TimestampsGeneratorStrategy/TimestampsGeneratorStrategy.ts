import { TimedText } from "../../../../videoTypes";

export interface TimestampsGeneratorStrategy {
    generateTimestampsBasedOnAudio(input: Buffer): Promise<TimedText[]>;
}
