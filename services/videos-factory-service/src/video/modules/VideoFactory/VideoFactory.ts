import fs from "fs";
import { join } from "path";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { extractFramesFromVideo } from "../../utils/extractFramesFromVideo";
import { AudioBuilder } from "./Builders/AudioBuilder";
import {
    BaseElementBuilder,
    ElementAssetType,
    elementAssetTypes,
} from "./Builders/BaseElementBuilder";
import { CompositionBuilder } from "./Builders/CompositionBuilder";
import { VideoBuilder } from "./Builders/VideoBuilder";

type Template = {
    duration: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    elements: BaseElementBuilder[];
};

type TemplateAsset = {
    id: string;
    name: string;
    type: ElementAssetType;
    sourcePath: string;
    decompressedPath?: string;
};

export class VideoFactory {
    static Audio = AudioBuilder;

    static Composition = CompositionBuilder;

    static Video = VideoBuilder;

    assets: TemplateAsset[];

    template: Template;

    constructor(template: Template) {
        this.template = template;

        this.assets = this.mapTemplateToAssets(template);

        this.cleanUpDirectories();
        this.decompressAssets();
    }

    public async render() {}

    private mapTemplateToAssets(template: Template) {
        const assets: TemplateAsset[] = [];

        console.log(`Mapping assets`);

        const recursivelyMapAssets = (elements: BaseElementBuilder[]) => {
            if (!elements.length) {
                return;
            }

            elements.forEach((x) => {
                if (!(x instanceof BaseElementBuilder)) {
                    return;
                }

                if (elementAssetTypes[x.type as ElementAssetType]) {
                    const asset: TemplateAsset = {
                        id: x.id,
                        name: x.name,
                        type: x.type as ElementAssetType,
                        sourcePath: (x as any).sourcePath, // TODO fix this any
                    };

                    assets.push(asset);
                }

                if ((x as any).elements?.length) {
                    recursivelyMapAssets((x as any).elements); // TODO fix this any
                }
            });
        };

        recursivelyMapAssets(template.elements);

        return assets;
    }

    private async decompressAssets() {
        console.log(`Extracting frames from videos...`);
        const videos = this.assets.filter((x) => x.type === "video");

        for (const asset of videos) {
            await extractFramesFromVideo(
                asset.sourcePath,
                join(getAssetsPath(`tmp/${asset.name}-${asset.id}`), "frame-%04d.png"),
                this.template.fps
            );
        }
        console.log("Videos frames extracted");
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
