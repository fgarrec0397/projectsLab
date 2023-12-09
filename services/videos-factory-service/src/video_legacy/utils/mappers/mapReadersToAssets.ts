import { Dictionary } from "@projectslab/helpers";
import { Image } from "canvas";

import { VideoReader } from "../../services/servicesTypes";

/**
 * Extract frames for all the passed readers and returns a dictionary
 * of scenes assets
 */
export const mapReadersToAssets = async <TemplateAssets extends Dictionary<Image> = any>(
    videoReaders: VideoReader[] | undefined
) => {
    const assets: Partial<TemplateAssets> = {};

    if (!videoReaders) {
        return assets as TemplateAssets;
    }

    for (const reader of videoReaders) {
        const asset = await reader.callback();

        assets[reader.slug as keyof TemplateAssets] = asset as TemplateAssets[keyof TemplateAssets];
    }

    return assets as TemplateAssets;
};
