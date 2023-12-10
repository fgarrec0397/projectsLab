import fs from "fs";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
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

        console.log(this.assets, "this.assets");

        this.cleanUpDirectories();
        // this.decompressAssets();
    }

    private mapTemplateToAssets(template: Template) {
        const assets: TemplateAsset[] = [];

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

    // private async decompressAssets() {
    //     this.videosReaders = [];

    //     for (const key of Object.keys(this.videosAssets)) {
    //         const asset = this.videosAssets[key](this.config);

    //         console.log(`Extracting frames from ${asset.name}...`);

    //         await extractFramesFromVideo(asset.path);

    //         const getVideoFrame = await getVideoFrameReader(
    //             asset.path,
    //             getAssetsPath(`tmp/${asset.name}-${key}`),
    //             this.config.frameRate
    //         );

    //         this.videosReaders.push({ slug: asset.slug, callback: getVideoFrame });
    //     }
    // }

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
