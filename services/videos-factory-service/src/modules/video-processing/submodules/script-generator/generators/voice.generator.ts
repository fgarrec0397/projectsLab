import OpenAI from "openai";
import { FileSystemService } from "src/common/files-system/services/file-system.service";
import { TempFoldersService } from "src/common/files-system/services/temp-folders.service";
import { OpenAIModule } from "src/common/OpenAI";

import { VideoUtils } from "../../../../../common/utils/video.utils";

export class VoiceGenerator {
    openai: OpenAI;

    audio: Buffer | undefined;

    fileSystem: FileSystemService;

    tempFoldersService: TempFoldersService;

    constructor() {
        this.openai = OpenAIModule.getModule();
        this.fileSystem = new FileSystemService();
        this.tempFoldersService = new TempFoldersService(this.fileSystem);
    }

    async generateVoice(text: string, voiceFilePath: string): Promise<Buffer> {
        console.log("Create audio with OpenAI");
        const { tempFolderPath, cleanUp } =
            this.tempFoldersService.getTempFolderPath("temp-voice-generation");
        const tempFilePath = `${tempFolderPath}/speech-temp.mp3`;
        const mp3 = await this.openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "echo",
            response_format: "mp3",
            input: text,
        });

        const tempAudio = Buffer.from(await mp3.arrayBuffer());
        await this.fileSystem.createFile(tempFilePath, tempAudio);

        await VideoUtils.resampleAudio(tempFilePath, voiceFilePath);

        const resampledAudio = await this.fileSystem.convertFileToBuffer(voiceFilePath);

        this.audio = resampledAudio;

        cleanUp();

        return this.audio;
    }
}
