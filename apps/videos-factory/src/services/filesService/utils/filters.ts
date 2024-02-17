import { IFile } from "@/types/file";

export const rootFileFilter = (file: IFile) => {
    const isFileAtRoot = file.path.split("/").length <= 2;

    return !isFileAtRoot;
};

export const noneRootFileFilter = (file: IFile, currentPath: string) => {
    if (file.path.startsWith(currentPath)) {
        const relativePath = file.path.substring(currentPath.length);

        return relativePath !== "/";
    }

    return false;
};
