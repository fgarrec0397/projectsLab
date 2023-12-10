import { BaseElementBuilder, BaseElementBuilderConfig, ElementType } from "./BaseElementBuilder";

type VideoConfig = BaseElementBuilderConfig & {
    sourcePath: string;
};

export class VideoBuilder extends BaseElementBuilder {
    type: ElementType;

    sourcePath: string;

    constructor(config: VideoConfig) {
        super(config);

        this.type = "video";
        this.sourcePath = config.sourcePath;
    }
}
