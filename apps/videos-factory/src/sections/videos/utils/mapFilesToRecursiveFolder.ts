import { IFile } from "@/types/file";

type Folder = {
    [key: string]: Folder | IFile[];
};

export const mapFilesToRecursiveFolder = (assets: IFile[]): Folder => {
    const root: Folder = {};

    assets.forEach((asset) => {
        const pathParts = asset.id.split("/");
        let currentLevel = root;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];

            if (i === pathParts.length - 1) {
                // It's a file
                if (!Array.isArray(currentLevel[part])) {
                    currentLevel[part] = [];
                }
                (currentLevel[part] as IFile[]).push(asset);
            } else {
                // It's a folder
                if (!currentLevel[part]) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part] as Folder;
            }
        }
    });

    return root;
};
