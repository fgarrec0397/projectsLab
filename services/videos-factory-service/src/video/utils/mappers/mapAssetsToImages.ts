import { loadImage } from "canvas";

import { VideoAssetDictionary, VideoConfig } from "../../controllers/v1/videoController";
import { TemplateAssetsDictionary } from "../../services/templateService";

export const mapAssetsToImages = async (config: VideoConfig, assets: VideoAssetDictionary) => {
    const images: Partial<TemplateAssetsDictionary> = {};

    for (const assetKey of Object.keys(assets)) {
        const asset = assets[assetKey](config);
        const image = await loadImage(asset.path);

        images[asset.slug as keyof TemplateAssetsDictionary] = image;
    }

    return images as TemplateAssetsDictionary;
};
