import { BaseElementBuilder, BaseElementBuilderConfig } from "./BaseElementBuilder";

type VideoConfig = BaseElementBuilderConfig & {
    sourcePath: string;
};

export class VideoBuilder implements BaseElementBuilder<VideoConfig> {
    constructor(config: VideoConfig) {
        console.log(config, "Video constructor");
    }
}
