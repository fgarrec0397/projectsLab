import { Image } from "canvas";

export type VideoSize = {
    width: number;
    height: number;
};

export type VideoOptions = {
    duration: number;
    frameRate: number;
    size: VideoSize;
};

export type VideoReader = {
    slug: string;
    callback: () => Promise<Image>;
};
