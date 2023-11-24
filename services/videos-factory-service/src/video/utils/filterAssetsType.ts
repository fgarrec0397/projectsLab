import { VideoAsset, VideoConfig } from "../controllers/v1/videoController";

export const filterAssetsType = (
    assets: VideoAsset[],
    config: VideoConfig,
    type: "in-video" | "final-render"
) =>
    assets.filter((x) => {
        const asset = x(config);

        return asset.type === type;
    });
