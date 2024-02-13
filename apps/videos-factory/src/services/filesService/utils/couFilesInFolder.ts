import { IFile } from "@/types/file";

export const countFilesInFolder = (items: IFile[], folderPath?: string): number => {
    if (!folderPath) {
        return 0;
    }

    let fileCount = 0;
    console.log(items, "items");

    // TODO - need to fix this
    if (folderPath === "root") {
        items.forEach((item) => {
            if (
                !item.path.substring(0, item.path.length - 1).includes("/") &&
                item.type !== "folder"
            ) {
                fileCount++;
            }
        });
    } else {
        const normalizedFolderPath = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;

        console.log({ normalizedFolderPath });

        items.forEach((item) => {
            if (item.path.startsWith(normalizedFolderPath) && item.type !== "folder") {
                fileCount++;
            }
        });
    }

    return fileCount;
};
