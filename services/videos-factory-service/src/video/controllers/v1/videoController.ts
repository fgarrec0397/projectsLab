import { Request, Response } from "express";

import { ScriptService } from "../../services/ScriptService";
import { TemplateService } from "../../services/TemplateService";
import { VideoService } from "../../services/VideoService";

const canRenderVideo = true;

export class VideoController {
    scriptService: ScriptService;

    templateService: TemplateService;

    videoService: VideoService;

    constructor(
        scriptService: ScriptService,
        templateService: TemplateService,
        videoService: VideoService
    ) {
        this.scriptService = scriptService;
        this.templateService = templateService;
        this.videoService = videoService;
    }

    get = async (_: Request, result: Response) => {
        const script = await this.scriptService.generateScript();

        const template = this.templateService.createTemplate("funFactsTemplate", {
            subtitles: script,
        }); // TODO - "funFactsTemplate" is temporary mocked

        try {
            if (!canRenderVideo) {
                result.status(200).json({ result: "Video not created" });
                return;
            }

            await this.videoService.generateVideo(template);

            result.status(200).json({ result: "Video created" });
        } catch (error) {
            console.log(error, "error");

            result.status(500).json({ error });
        }
    };
}
