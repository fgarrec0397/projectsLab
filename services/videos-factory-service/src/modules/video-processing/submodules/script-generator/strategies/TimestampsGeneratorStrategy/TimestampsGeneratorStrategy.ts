import { Script } from "../../script-generator.service";

export interface TimestampsGeneratorStrategy {
    generateTimestampsBasedOnAudio(input: Buffer): Promise<Script>;
}
