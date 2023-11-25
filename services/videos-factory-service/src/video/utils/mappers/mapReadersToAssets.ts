import { SceneAssetsDictionary } from "../../services/sceneService";
import { VideoReader } from "../../services/videoService";

/**
 * Extract frames for all the passed readers and returns a dictionary
 * of scenes assets
 */
export const mapReadersToAssets = async (videoReaders: VideoReader[] | undefined) => {
    const assets: Partial<SceneAssetsDictionary> = {};

    if (!videoReaders) {
        return assets as SceneAssetsDictionary;
    }

    for (const reader of videoReaders) {
        const asset = await reader.callback();

        assets[reader.slug as keyof SceneAssetsDictionary] = asset;
    }

    return assets as SceneAssetsDictionary;
};
