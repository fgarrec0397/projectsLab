import { Request, Response } from "express";

import S3StorageManager from "../../../core/modules/S3StorageManager";
import { Script } from "../../modules/ScriptManager/ScriptManager";
import { ScriptService } from "../../services/ScriptService";
import { TemplateService } from "../../services/TemplateService";
import { VideoService } from "../../services/VideoService";
import { Template } from "../../videoTypes";

const canGenerateScript = true;
const canGenerateTemplate = true;
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
        let script: Script = {};
        let template: Template | undefined = undefined;

        const storageManager = new S3StorageManager();
        const filesList = await storageManager.listFiles("assets");

        console.log(JSON.stringify(filesList), "filesList from get");

        if (canGenerateScript) {
            script = await this.scriptService.generateScript();
        }

        if (canGenerateTemplate) {
            this.templateService.prepareTemplate("funFactsTemplate", script); // TODO - "funFactsTemplate" is temporary mocked
            template = await this.templateService.createTemplate();
        }

        try {
            if (!canRenderVideo) {
                result.status(200).json({ result: "Video not created" });
                return;
            }

            if (template) {
                await this.videoService.generateVideo(template);
            }

            result.status(200).json({ result: "Video created" });
        } catch (error) {
            console.log(error, "error");

            result.status(500).json({ error });
        }
    };
}
