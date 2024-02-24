import { Inject, Injectable } from "@nestjs/common";
import {
    TEXT_GENERATOR_STRATEGY_TOKEN,
    TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
    VOICE_GENERATOR_STRATEGY_TOKEN,
} from "src/common/dependencies_tokens";
import { FileSystem } from "src/common/FileSystem";

import { TimedSentence, TimedText } from "../video-renderer/video-renderer.types";
import { IVideo } from "../videos/videosTypes";
import { TextGeneratorStrategy } from "./strategies/TextGeneratorStrategy/TextGeneratorStrategy";
import { TimestampsGeneratorStrategy } from "./strategies/TimestampsGeneratorStrategy/TimestampsGeneratorStrategy";
import { VoiceGeneratorStrategy } from "./strategies/VoiceGeneratorStrategy/VoiceGeneratorStrategy";

export type Script =
    | {
          duration?: number;
          subtitles?: TimedText[];
          sentences?: TimedSentence[];
      }
    | undefined;

@Injectable()
export class ScriptGeneratorService {
    private script: Script;

    private voiceBuffer: Buffer | undefined;

    private voiceFilePath: string = FileSystem.getAssetsPath("speech.mp3");

    private text: string | undefined;

    constructor(
        @Inject(TEXT_GENERATOR_STRATEGY_TOKEN)
        private textGeneratorStrategy: TextGeneratorStrategy,
        @Inject(VOICE_GENERATOR_STRATEGY_TOKEN)
        private voiceGeneratorStrategy: VoiceGeneratorStrategy,
        @Inject(TIMESTAMPS_GENERATOR_STRATEGY_TOKEN)
        private timestampsGeneratorStrategy: TimestampsGeneratorStrategy
    ) {}

    async generateScript(video: IVideo) {
        await this.generateText(video);
        await this.generateVoice();
        await this.generateTimestampsBasedOnAudio();

        return this.script;
    }

    private async generateText(video: IVideo) {
        this.text = await this.textGeneratorStrategy.generateText(video);
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
