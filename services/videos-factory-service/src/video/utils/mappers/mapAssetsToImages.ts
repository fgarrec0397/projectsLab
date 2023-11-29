import { Dictionary } from "@projectslab/helpers";
import { Image, loadImage } from "canvas";

import { VideoAssetDictionary, VideoConfig } from "../../controllers/v1/videoController";

export const mapAssetsToImages = async <TemplateAssets extends Dictionary<Image> = any>(
    config: VideoConfig,
    assets: VideoAssetDictionary
) => {
    const images: Partial<TemplateAssets> = {};

    for (const assetKey of Object.keys(assets)) {
        const asset = assets[assetKey](config);
        const image = await loadImage(asset.path);

        images[asset.slug as keyof TemplateAssets] = image as TemplateAssets[keyof TemplateAssets];
    }

    return images as TemplateAssets;
};
