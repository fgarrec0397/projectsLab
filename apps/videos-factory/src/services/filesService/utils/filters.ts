import { IFile } from "@/types/file";

export const rootFileFilter = (file: IFile) => {
    const pathWithTrailingSlash = file.path.substring(0, file.path.length - 1);

    const isPathContainsSlash = pathWithTrailingSlash.includes("/");
    console.log({ file, pathWithTrailingSlash, isPathContainsSlash });

    const isFileDeeper = file.path.split("/").length > 2;

    return !isFileDeeper;
};

export const noneRootFileFilter = (file: IFile, currentPath: string) => {
    if (file.path.startsWith(currentPath)) {
        const relativePath = file.path.substring(currentPath.length);

        return relativePath !== "/";
    }

    return false;
};
