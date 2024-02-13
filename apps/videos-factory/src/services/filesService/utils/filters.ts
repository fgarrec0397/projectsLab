import { IFile } from "@/types/file";

export const rootFileFilter = (file: IFile) => {
    const pathWithTrailingSlash = file.path.substring(0, file.path.length - 1);

    const isPathContainsSlash = pathWithTrailingSlash.includes("/");

    return !isPathContainsSlash;
};

export const noneRootFileFilter = (file: IFile, currentPath: string) => {
    if (file.path.startsWith(currentPath)) {
        const relativePath = file.path.substring(currentPath.length);

        return relativePath !== "/";
    }

    return false;
};
