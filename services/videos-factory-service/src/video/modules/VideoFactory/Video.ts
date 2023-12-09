type VideoConfig = {
    name: string;
    sourcePath: string;
};

export class Video {
    constructor(config: VideoConfig) {
        console.log(config, "Video constructor");
    }
}
