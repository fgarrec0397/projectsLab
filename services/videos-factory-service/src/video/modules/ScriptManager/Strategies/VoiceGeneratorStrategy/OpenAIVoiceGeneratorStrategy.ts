import fs from "fs";
import OpenAI from "openai";

import { OpenAIModule } from "../../../../../core/modules/OpenAI";
import { convertMp3ToBuffer } from "../../../../../core/utils/convertMp3ToBuffer";
import { getAssetsPath } from "../../../../../core/utils/getAssetsPath";
import { VideoUtils } from "../../../VideoRenderer/Utilities/VideoUtils";
import { VoiceGeneratorStrategy } from "./VoiceGeneratorStrategy";

export class OpenAIVoiceGeneratorStrategy implements VoiceGeneratorStrategy {
    tempVoiceFilePath: string = getAssetsPath("speech-temp.flac");

    openai: OpenAI;

    audio: Buffer | undefined;

    constructor() {
        this.openai = OpenAIModule.getModule();
    }

    async generateVoice(input: string, voiceFilePath: string): Promise<Buffer> {
        console.log("Create audio with OpenAI");

        const mp3 = await this.openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "echo",
            response_format: "flac",
            input,
        });

        const tempAudio = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(this.tempVoiceFilePath, tempAudio);

        console.log("Resample the audio");
        await VideoUtils.resampleAudio(this.tempVoiceFilePath, voiceFilePath);

        const resampledAudio = await convertMp3ToBuffer(voiceFilePath);

        this.audio = resampledAudio;

        return this.audio;
    }
}
