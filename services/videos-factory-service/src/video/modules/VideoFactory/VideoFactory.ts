import fs from "fs";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { AudioBuilder } from "./Builders/AudioBuilder";
import { CompositionBuilder } from "./Builders/CompositionBuilder";
import { TemplateBuilder } from "./Builders/TemplateBuilder";
import { VideoBuilder } from "./Builders/VideoBuilder";

export class VideoFactory {
    static Audio = AudioBuilder;

    static Composition = CompositionBuilder;

    static Template = TemplateBuilder;

    static Video = VideoBuilder;

    template: Template;

    constructor(template: Template) {
        this.template = template;

        this.cleanUpDirectories();
        this.decompressAssets();
    }

    private decompressAssets() {
        this.videosReaders = [];

        for (const key of Object.keys(this.videosAssets)) {
            const asset = this.videosAssets[key](this.config);

            console.log(`Extracting frames from ${asset.name}...`);

            const getVideoFrame = await getVideoFrameReader(
                asset.path,
                getAssetsPath(`tmp/${asset.name}-${key}`),
                this.config.frameRate
            );

            this.videosReaders.push({ slug: asset.slug, callback: getVideoFrame });
        }
    }

    /**
     * Clean up the temporary directories
     */
    private async cleanUpDirectories() {
        for (const path of [getAssetsPath("out"), getAssetsPath("tmp/output")]) {
            if (fs.existsSync(path)) {
                await fs.promises.rm(path, { recursive: true });
            }
            await fs.promises.mkdir(path, { recursive: true });
        }
    }
}
