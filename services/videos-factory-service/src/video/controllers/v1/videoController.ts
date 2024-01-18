import { Request, Response } from "express";

import { TemplateGenerator } from "../../modules/TemplateGenerator/TemplateGenerator";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { ScriptService } from "../../services/ScriptService";
import { funFactsTemplate } from "../../templates/funFactsTemplate/funFactsTemplate";

const canRenderVideo = false;

export class VideoController {
    scriptService: ScriptService;

    constructor(scriptService: ScriptService) {
        this.scriptService = scriptService;
    }

    async get(_: Request, result: Response) {
        const subtitles = await this.scriptService.generateScript();

        if (canRenderVideo) {
            const templateGenerator = new TemplateGenerator({ subtitles });
            const template = templateGenerator.createTemplate(funFactsTemplate);
            const videoFactory = new VideoRenderer(template);
            await videoFactory.initRender();
        }

        result.status(200).json({ result: "video controller GET" });
    }
}
