import { SyncPrerecordedResponse } from "@deepgram/sdk";
import { Request, Response } from "express";

import { FilesSystem } from "../../../core/modules/FilesSystem";
import { ScriptManager } from "../../modules/ScriptManager/ScriptManager";
import { OpenAITextGeneratorStrategy } from "../../modules/ScriptManager/Strategies/TextGeneratorStrategy/OpenAITextGeneratorStrategy";
import { DeepgramTimestampsGeneratorStrategy } from "../../modules/ScriptManager/Strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "../../modules/ScriptManager/Strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";
import { TemplateGenerator } from "../../modules/TemplateGenerator/TemplateGenerator";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { funFactsTemplate } from "../../templates/funFactsTemplate/funFactsTemplate";
import { TimedText } from "../../videoTypes";

const canGenerateScript = true;
const canRenderVideo = false;

class VideoController {
    async get(_: Request, result: Response) {
        const openAITTextGeneratorStrategy = new OpenAITextGeneratorStrategy();
        const openAIVoiceGeneratorStrategy = new OpenAIVoiceGeneratorStrategy();
        const deepgramTimestampsGeneratorStrategy = new DeepgramTimestampsGeneratorStrategy();

        let subtitles: TimedText[] = [];

        if (canGenerateScript) {
            const scriptManager = new ScriptManager({
                textGeneratorStrategy: openAITTextGeneratorStrategy,
                voiceGeneratorStrategy: openAIVoiceGeneratorStrategy,
                timestampsGeneratorStrategy: deepgramTimestampsGeneratorStrategy,
            });

            await scriptManager.generateScript();

            subtitles = scriptManager.subtitles;
        } else {
            const subtitlesJson = FilesSystem.loadJson<SyncPrerecordedResponse>(
                FilesSystem.getAssetsPath("mock-deepgram-subtitles.json")
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
