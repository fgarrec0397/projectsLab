import ffmpeg from "fluent-ffmpeg";

import { BaseElement } from "../Entities/BaseElement";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export interface IFragmentableComponent<FragmentableType = any> extends IElementComponent {
    getFragment: () => FragmentableType;
    fragmentProcess: (
        ffmpegCommand: ffmpeg.FfmpegCommand,
        fragments: FragmentableType
    ) => Promise<void>;
}

export class FragmentableComponent<T extends BaseElement> extends BaseComponent<T> {}
