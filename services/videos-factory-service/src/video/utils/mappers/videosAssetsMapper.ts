import { uidGenerator } from "@projectslab/helpers";

import {
    VideoAssetCallback,
    VideoAssetDictionary,
    VideoConfig,
} from "../../controllers/v1/videoController";

export const videosAssetsMapper = (
    videosAssetsArray: VideoAssetCallback[],
    config: VideoConfig
) => {
    const assetsDictionary: VideoAssetDictionary = {};

    videosAssetsArray.forEach((assetCallback) => {
        const asset = assetCallback(config);
        const id = uidGenerator();

        const assetDictionaryItem: VideoAssetCallback = () => ({
            id,
            ...asset,
        });

        assetsDictionary[id] = assetDictionaryItem;
    });

    return assetsDictionary;
};
