import { VideoAssetDictionary, VideoConfig } from "../controllers/v1/videoController";

export const filterAssetsType = (
    assets: VideoAssetDictionary,
    config: VideoConfig,
    type: "in-video" | "final-render"
) => {
    const filteredAssets: VideoAssetDictionary = {};

    Object.keys(assets).forEach((x) => {
        const asset = assets[x](config);

        if (!asset.id) {
            return;
        }

        if (asset.type === type) {
            filteredAssets[asset.id] = () => asset;
        }
    });

    return filteredAssets;
};
