import { TemplateAssetsDictionary } from "../../services/templateService";
import { VideoReader } from "../../services/videoService";

/**
 * Extract frames for all the passed readers and returns a dictionary
 * of scenes assets
 */
export const mapReadersToAssets = async (videoReaders: VideoReader[] | undefined) => {
    const assets: Partial<TemplateAssetsDictionary> = {};

    if (!videoReaders) {
        return assets as TemplateAssetsDictionary;
    }

    for (const reader of videoReaders) {
        const asset = await reader.callback();

        assets[reader.slug as keyof TemplateAssetsDictionary] = asset;
    }

    return assets as TemplateAssetsDictionary;
};
