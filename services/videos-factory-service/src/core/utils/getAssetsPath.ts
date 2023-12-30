import path from "path";

export const getAssetsPath = (assetPath: string) => {
    return path.resolve("./assets/poc", assetPath);
};
