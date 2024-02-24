import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { FileSystem } from "src/common/FileSystem";
import { OpenAIModule } from "src/common/OpenAI";
import { VideoUtils } from "src/modules/video-renderer/video.utils";

import { VoiceGeneratorStrategy } from "./VoiceGeneratorStrategy";

@Injectable()
export class OpenAIVoiceGeneratorStrategy implements VoiceGeneratorStrategy {
    tempVoiceFilePath: string = FileSystem.getAssetsPath("speech-temp.mp3");

    openai: OpenAI;

    audio: Buffer | undefined;

    constructor() {
        this.openai = OpenAIModule.getModule();
    }

    async generateVoice(text: string, voiceFilePath: string): Promise<Buffer> {
        console.log("Create audio with OpenAI");

        const mp3 = await this.openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "echo",
            response_format: "mp3",
            input: text,
        });

        const tempAudio = Buffer.from(await mp3.arrayBuffer());
        await FileSystem.createFile(this.tempVoiceFilePath, tempAudio);

        console.log("Resample the audio");
        await VideoUtils.resampleAudio(this.tempVoiceFilePath, voiceFilePath);

        const resampledAudio = await FileSystem.convertFileToBuffer(voiceFilePath);

        this.audio = resampledAudio;

        return this.audio;
    }
}
