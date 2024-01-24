export interface StorageStrategy {
    uploadFile: <ResponseType>(
        fileName: string,
        filePath: string,
        mimeType: string
    ) => ResponseType;
    downloadFile: (fileId: string, destinationPath: string) => void;
}
