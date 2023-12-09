import { isMatch } from "@projectslab/helpers";

import {
    VideoAsset,
    VideoAssetDictionary,
    VideoConfig,
} from "../../controllers/v1/videoController";

/**
 *
 * Filter assets based on the given key and value
 *
 * @param assets The assets to filter
 * @param config The config of the video
 * @param filter The filter object based on to return the filtered asset
 * @returns The filtered assets
 */
export const filterAssets = (
    assets: VideoAssetDictionary,
    config: VideoConfig,
    filter: Partial<VideoAsset>
) => {
    const filteredAssets: VideoAssetDictionary = {};

    Object.keys(assets).forEach((x) => {
        const asset = assets[x](config);

        if (!asset.id) {
            return;
        }

        if (isMatch(asset, filter)) {
            filteredAssets[asset.id] = () => asset;
        }
    });

    return filteredAssets;
};
