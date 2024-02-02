import { FileSystem } from "../../../core/modules/FileSystem";
import { TimedSentence, TimedText } from "../../videoTypes";
import { TextGeneratorStrategy } from "./Strategies/TextGeneratorStrategy/TextGeneratorStrategy";
import { TimestampsGeneratorStrategy } from "./Strategies/TimestampsGeneratorStrategy/TimestampsGeneratorStrategy";
import { VoiceGeneratorStrategy } from "./Strategies/VoiceGeneratorStrategy/VoiceGeneratorStrategy";

type ScriptManagerDependencies = {
    textGeneratorStrategy: TextGeneratorStrategy;
    voiceGeneratorStrategy: VoiceGeneratorStrategy;
    timestampsGeneratorStrategy: TimestampsGeneratorStrategy;
};

export type Script =
    | {
          duration?: number;
          subtitles?: TimedText[];
          sentences?: TimedSentence[];
      }
    | undefined;

export class ScriptManager {
    private script: Script;

    private voiceBuffer: Buffer | undefined;

    private voiceFilePath: string = FileSystem.getAssetsPath("speech.mp3");

    private text: string | undefined;

    private textGeneratorStrategy: TextGeneratorStrategy;

    private voiceGeneratorStrategy: VoiceGeneratorStrategy;

    private timestampsGeneratorStrategy: TimestampsGeneratorStrategy;

    constructor(dependencies: ScriptManagerDependencies) {
        this.textGeneratorStrategy = dependencies.textGeneratorStrategy;
        this.voiceGeneratorStrategy = dependencies.voiceGeneratorStrategy;
        this.timestampsGeneratorStrategy = dependencies.timestampsGeneratorStrategy;
    }

    async generateScript() {
        await this.generateText();
        await this.generateVoice();
        await this.generateTimestampsBasedOnAudio();

        return this.script;
    }

    private async generateText() {
        this.text = await this.textGeneratorStrategy.generateText();
    }

    private async generateVoice() {
        if (!this.text) {
            return;
        }

        this.voiceBuffer = await this.voiceGeneratorStrategy.generateVoice(
            this.text,
            this.voiceFilePath
        );
        await FileSystem.createFile(this.voiceFilePath, this.voiceBuffer);
    }

    private async generateTimestampsBasedOnAudio() {
        if (!this.voiceBuffer) {
            return;
        }
        this.script = await this.timestampsGeneratorStrategy.generateTimestampsBasedOnAudio(
            this.voiceBuffer
        );
    }
}