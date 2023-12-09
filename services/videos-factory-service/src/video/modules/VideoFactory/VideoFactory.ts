import { Audio } from "./Audio";
import { Composition } from "./Composition";
import { Template } from "./Template";
import { Video } from "./Video";

export class VideoFactory {
    static Audio = Audio;

    static Composition = Composition;

    static Template = Template;

    static Video = Video;

    constructor() {
        console.log("VideoFactory constructor");
    }
}
