import { IFile } from "@/types/file";

export type RecuriveFilesTree = {
    [key: string]: RecuriveFilesTree | IFile;
};

export const mapFilesToRecursiveFolder = (files: IFile[]): RecuriveFilesTree => {
    const root: RecuriveFilesTree = {};

    files.forEach((file) => {
        const parts = file.id.split("/");
        let currentLevel = root;

        parts.shift();

        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                currentLevel[part] = file;
            } else {
                if (!currentLevel[part]) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part] as RecuriveFilesTree;
            }
        });
    });

    return root;
};
