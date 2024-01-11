import { Request, Response } from "express";

import { ScriptManager } from "../../modules/ScriptManager/ScriptManager";
import { GoogleTimestampsGeneratorStrategy } from "../../modules/ScriptManager/Strategies/TimestampsGeneratorStrategy/GoogleTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "../../modules/ScriptManager/Strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { funFactsTemplate } from "../../templates/funFactsTemplate/funFactsTemplate";

const canGenerateScript = false;
const canRenderVideo = true;

class VideoController {
    async get(request: Request, result: Response) {
        if (canGenerateScript) {
            const scriptManager = new ScriptManager(
                new OpenAIVoiceGeneratorStrategy(),
                new GoogleTimestampsGeneratorStrategy()
            );

            await scriptManager.generateScript();

            console.log(scriptManager.subtitles, "scriptManager.subtitles");
        }

        if (canRenderVideo) {
            const videoFactory = new VideoRenderer(funFactsTemplate);
            await videoFactory.initRender();
        }

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
