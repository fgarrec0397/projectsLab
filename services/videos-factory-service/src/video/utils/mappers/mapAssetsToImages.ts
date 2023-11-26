import { loadImage } from "canvas";

import { VideoAssetDictionary, VideoConfig } from "../../controllers/v1/videoController";
import { SceneAssetsDictionary } from "../../services/sceneService";

export const mapAssetsToImages = async (config: VideoConfig, assets: VideoAssetDictionary) => {
    const images: Partial<SceneAssetsDictionary> = {};

    for (const assetKey of Object.keys(assets)) {
        const asset = assets[assetKey](config);
        const image = await loadImage(asset.path);

        images[asset.slug as keyof SceneAssetsDictionary] = image;
    }

    return images as SceneAssetsDictionary;
};
