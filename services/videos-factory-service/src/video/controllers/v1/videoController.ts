import { Request, Response } from "express";

import StorageManager from "../../../core/modules/StorageManager";
import { ScriptService } from "../../services/ScriptService";
import { TemplateService } from "../../services/TemplateService";
import { VideoService } from "../../services/VideoService";
import { Template, TimedText } from "../../videoTypes";

const canRenderVideo = false;
const canGenerateScript = false;
const canGenerateTemplate = false;

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
        let script: TimedText[] = [];
        let template: Template | undefined = undefined;
        const storageManager = new StorageManager();

        const filesList = await storageManager.getAssets();
        const mappedFilesName = filesList.files?.map((x) => ({
            name: x.name,
            type: x.mimeType,
        }));

        console.log(JSON.stringify(filesList), "filesList");
        console.log(mappedFilesName, "mappedFilesName");

        if (canGenerateScript) {
            script = await this.scriptService.generateScript();
        }

        if (canGenerateTemplate) {
            this.templateService.prepareTemplate("funFactsTemplate", script); // TODO - "funFactsTemplate" is temporary mocked
            template = this.templateService.createTemplate();
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
