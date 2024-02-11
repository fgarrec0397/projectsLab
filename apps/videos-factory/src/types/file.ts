import AWS from "aws-sdk";

// ----------------------------------------------------------------------

export type IFileFilterValue = string | string[] | Date | null;

export type IFileFilters = {
    name: string;
    type: string[];
    startDate: Date | null;
    endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IFileShared = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    permission: string;
};

export type IFolderManager = {
    id: string;
    name: string;
    path: string;
    size: 0;
    type: "folder";
    url: string;
    modifiedAt: Date | number | string;
};

export type IFileManager = {
    id: string;
    name: string;
    path: string;
    size: number;
    type: string;
    url: string;
    modifiedAt: Date | number | string;
};

export type IFile = IFileManager | IFolderManager;

// ----------------------------------------------------------------------

export type IFileDTO = AWS.S3.Object;
