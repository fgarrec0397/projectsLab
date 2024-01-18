import { VideoController } from "./controllers/v1/VideoController";
import { OpenAITextGeneratorStrategy } from "./modules/ScriptManager/Strategies/TextGeneratorStrategy/OpenAITextGeneratorStrategy";
import { DeepgramTimestampsGeneratorStrategy } from "./modules/ScriptManager/Strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "./modules/ScriptManager/Strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";
import { ScriptService } from "./services/ScriptService";

export class Video {
    static instantiateController() {
        const textGenStrategy = new OpenAITextGeneratorStrategy();
        const voiceGenStrategy = new OpenAIVoiceGeneratorStrategy();
        const timestampsGenStrategy = new DeepgramTimestampsGeneratorStrategy();

        const scriptService = new ScriptService(
            textGenStrategy,
            voiceGenStrategy,
            timestampsGenStrategy
        );

        const videoController = new VideoController(scriptService);

        return videoController;
    }
}
