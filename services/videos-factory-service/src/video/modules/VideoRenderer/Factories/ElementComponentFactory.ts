import { CanvasRenderer } from "../../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { AudioComponent } from "../Components/AudioComponent";
import { IElementComponent } from "../Components/BaseComponent";
import { CompositionComponent } from "../Components/CompositionComponent";
import { TextComponent } from "../Components/TextComponent";
import { VideoComponent } from "../Components/VideoComponent";
import { Audio } from "../Entities/Audio";
import { BaseElement } from "../Entities/BaseElement";
import { Composition } from "../Entities/Composition";
import { Text } from "../Entities/Text";
import { Video } from "../Entities/Video";

export class ElementComponentFactory {
    canvasRenderer: CanvasRenderer;

    complexFilterBuilder: ComplexFilterBuilder;

    constructor(complexFilterBuilder: ComplexFilterBuilder, canvasRenderer: CanvasRenderer) {
        this.complexFilterBuilder = complexFilterBuilder;
        this.canvasRenderer = canvasRenderer;
    }

    createElementComponent(element: BaseElement): IElementComponent | undefined {
        if (element.type === "composition") {
            const composition = element as Composition;

            const childComponents = composition.elements.map(
                this.createElementComponent.bind(this)
            );
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

            return new TextComponent(text, this.complexFilterBuilder, this.canvasRenderer);
        }

        throw new Error("Element not found");
    }

    createFragmentComponents(element: BaseElement): IElementComponent | undefined {
        if (element instanceof Text) {
            const text = element as Text;

            return new TextComponent(text, this.complexFilterBuilder, this.canvasRenderer);
        }
    }
}
