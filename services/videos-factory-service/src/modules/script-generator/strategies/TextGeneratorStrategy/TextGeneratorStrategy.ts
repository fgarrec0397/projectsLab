import { IVideo } from "src/modules/videos/videosTypes";

export interface TextGeneratorStrategy {
    generateText(video: IVideo): Promise<string>;
}
