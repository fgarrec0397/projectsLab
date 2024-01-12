import { SyncPrerecordedResponse } from "@deepgram/sdk";
import { Request, Response } from "express";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { loadJson } from "../../../core/utils/loadJson";
import { ScriptManager } from "../../modules/ScriptManager/ScriptManager";
import { DeepgramTimestampsGeneratorStrategy } from "../../modules/ScriptManager/Strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "../../modules/ScriptManager/Strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";
import { TemplateGenerator } from "../../modules/TemplateGenerator/TemplateGenerator";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { funFactsTemplate } from "../../templates/funFactsTemplate/funFactsTemplate";
import { TimedText } from "../../videoTypes";

const canGenerateScript = false;
const canRenderVideo = true;

class VideoController {
    async get(request: Request, result: Response) {
        const openAIVoiceGeneratorStrategy = new OpenAIVoiceGeneratorStrategy();
        const deepgramTimestampsGeneratorStrategy = new DeepgramTimestampsGeneratorStrategy();

        let subtitles: TimedText[] = [];

        if (canGenerateScript) {
            const scriptManager = new ScriptManager(
                openAIVoiceGeneratorStrategy,
                deepgramTimestampsGeneratorStrategy
            );

            await scriptManager.generateScript();

            subtitles = scriptManager.subtitles;
        } else {
            const subtitlesJson = loadJson<SyncPrerecordedResponse>(
                getAssetsPath("mock-deepgram-subtitles.json")
            );

            subtitles = deepgramTimestampsGeneratorStrategy.mapDataToTimedText(subtitlesJson);
        }

        if (canRenderVideo) {
            const templateGenerator = new TemplateGenerator({ subtitles });
            const template = templateGenerator.createTemplate(funFactsTemplate);
            const videoFactory = new VideoRenderer(template);
            await videoFactory.initRender();
        }

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
