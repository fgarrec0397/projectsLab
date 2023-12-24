import { join } from "path";

import { getAssetsPath } from "../../../../core/utils/getAssetsPath";
import {
    RenderableElement,
    RenderableElementConfig,
    RenderableElementTypes,
} from "./RenderableElement";

type VideoConfig = RenderableElementConfig;

export class Video extends RenderableElement {
    type: RenderableElementTypes;

    sourcePath: string;

    decompressPath: string;

    constructor(config: VideoConfig) {
        super(config);

        this.type = "video";
        this.sourcePath = config.sourcePath;
        this.decompressPath = this.getDecompressPath(config);
    }

    private getDecompressPath(config: VideoConfig) {
        return join(getAssetsPath(`tmp/${config.name}-${config.id}`), "frame-%04d.png");
    }
}
