import { VideoController } from "./controllers/v1/videoController";
import { OpenAITextGeneratorStrategy } from "./modules/ScriptManager/Strategies/TextGeneratorStrategy/OpenAITextGeneratorStrategy";
import { DeepgramTimestampsGeneratorStrategy } from "./modules/ScriptManager/Strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "./modules/ScriptManager/Strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";
import { TemplateGenerator } from "./modules/TemplateGenerator/TemplateGenerator";
import { VideoRenderer } from "./modules/VideoRenderer/VideoRenderer";
import { ScriptService } from "./services/ScriptService";
import { TemplateService } from "./services/TemplateService";
import { VideoService } from "./services/VideoService";

export class Video {
    static instantiateController() {
        const textGenStrategy = new OpenAITextGeneratorStrategy();
        const voiceGenStrategy = new OpenAIVoiceGeneratorStrategy();
        const timestampsGenStrategy = new DeepgramTimestampsGeneratorStrategy();
        const videoRenderer = new VideoRenderer();
        const templateGenerator = new TemplateGenerator();

        const scriptService = new ScriptService(
            textGenStrategy,
            voiceGenStrategy,
            timestampsGenStrategy
        );
        const templateService = new TemplateService(templateGenerator);
        const videoService = new VideoService(videoRenderer);

        const videoController = new VideoController(scriptService, templateService, videoService);

        return videoController;
    }
}
