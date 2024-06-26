import { CanvasRendererService } from "src/modules/canvas-renderer/canvas-renderer.service";

import { AssFileBuilder } from "../builders/ass-file.builder";
import { ComplexFilterBuilder } from "../builders/video-complexfilter.builder";
import { AudioComponent } from "../components/AudioComponent";
import { IElementComponent } from "../components/BaseComponent";
import { CompositionComponent } from "../components/CompositionComponent";
import { TextComponent } from "../components/TextComponent";
import { VideoComponent } from "../components/VideoComponent";
import { Audio } from "../entities/Audio";
import { BaseElement } from "../entities/BaseElement";
import { Composition } from "../entities/Composition";
import { Text } from "../entities/Text";
import { Video } from "../entities/Video";

export type ComponentConfig = {
    videoOutputPath: string;
};

export class ElementComponentFactory {
    constructor(
        private readonly complexFilterBuilder: ComplexFilterBuilder,
        private readonly assFileBuilder: AssFileBuilder,
        private readonly canvasRenderer: CanvasRendererService,
        private readonly config: ComponentConfig
    ) {
        this.complexFilterBuilder = complexFilterBuilder;
        this.canvasRenderer = canvasRenderer;
    }

    createElementComponent(element: BaseElement): IElementComponent | undefined {
        if (element.type === "composition") {
            const composition = element as Composition;

            const childComponents = composition.elements.map(
                this.createElementComponent.bind(this)
            ) as IElementComponent[];
            return new CompositionComponent(
                composition,
                childComponents,
                this.complexFilterBuilder
            );
        }

        if (element.type === "video") {
            const video = element as Video;

            return new VideoComponent(video, this.complexFilterBuilder);
        }

        if (element.type === "audio") {
            const audio = element as Audio;

            return new AudioComponent(audio, this.complexFilterBuilder);
        }

        if (element.type === "text") {
            const text = element as Text;

            return new TextComponent(
                text,
                this.complexFilterBuilder,
                this.assFileBuilder,
                this.config
            );
        }

        throw new Error("Element not found");
    }

    createFragmentComponents(element: BaseElement): IElementComponent | undefined {
        if (element instanceof Text) {
            const text = element as Text;

            return new TextComponent(
                text,
                this.complexFilterBuilder,
                this.assFileBuilder,
                this.config
            );
        }
    }
}
