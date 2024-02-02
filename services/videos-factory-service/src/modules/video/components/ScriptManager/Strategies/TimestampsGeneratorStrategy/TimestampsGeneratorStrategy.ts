import { Script } from "../../ScriptManager";

export interface TimestampsGeneratorStrategy {
    generateTimestampsBasedOnAudio(input: Buffer): Promise<Script>;
}
