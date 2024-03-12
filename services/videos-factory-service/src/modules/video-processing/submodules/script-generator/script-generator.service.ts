import { Injectable } from "@nestjs/common";
import { FileSystem } from "src/common/FileSystem";
import { IVideo } from "src/modules/videos/videos.types";

import { TimedSentence, TimedText } from "../video-renderer/video-renderer.types";
import { TextGenerator } from "./generators/text.generator";
import { TimestampsGenerator } from "./generators/timestamps.generator";
import { VoiceGenerator } from "./generators/voice.generator";

export type Script =
    | {
          duration?: number;
          subtitles?: TimedText[];
          sentences?: TimedSentence[];
      }
    | undefined;

@Injectable()
export class ScriptGeneratorService {
    private textGenerator: TextGenerator;

    private voiceGenerator: VoiceGenerator;

    private timestampsGenerator: TimestampsGenerator;

    private script: Script;

    private voiceBuffer: Buffer | undefined;

    private text: string | undefined;

    private speechFilePath: string | undefined;

    init(video: IVideo) {
        this.textGenerator = new TextGenerator(video);
        this.voiceGenerator = new VoiceGenerator();
        this.timestampsGenerator = new TimestampsGenerator(video);
    }

    async generateScript(speechFilePath: string) {
        this.speechFilePath = speechFilePath;

        await this.generateText();
        await this.generateVoice();
        await this.generateTimestampsBasedOnAudio();

        return this.script;
    }

    private async generateText() {
        this.text = await this.textGenerator.generateText();
    }

    private async generateVoice() {
        if (!this.text) {
            return;
        }

        await FileSystem.createFile(this.speechFilePath);

        this.voiceBuffer = await this.voiceGenerator.generateVoice(this.text, this.speechFilePath);

        await FileSystem.createFile(this.speechFilePath, this.voiceBuffer);
    }

    private async generateTimestampsBasedOnAudio() {
        if (!this.voiceBuffer) {
            return;
        }
        this.script = await this.timestampsGenerator.generateTimestampsBasedOnAudio(
            this.voiceBuffer
        );
    }
}
