import dynamic from "next/dynamic";

export { default as RejectionFiles } from "./errors-rejection-files";
export { default as MultiFilePreview } from "./preview-multi-file";
export { default as SingleFilePreview } from "./preview-single-file";
export * from "./types";

export const Upload = dynamic(() => import("./upload"), {
    ssr: false,
});

export const UploadBox = dynamic(() => import("./upload-box"), {
    ssr: false,
});

export const UploadAvatar = dynamic(() => import("./upload-avatar"), {
    ssr: false,
});
