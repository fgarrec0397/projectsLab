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
        if (element instanceof Composition) {
            const childComponents = element.elements.map(this.createElementComponent.bind(this));
            return new CompositionComponent(element, childComponents, this.complexFilterBuilder);
        }

        if (element instanceof Video) {
            return new VideoComponent(element, this.complexFilterBuilder);
        }

        if (element instanceof Audio) {
            return new AudioComponent(element, this.complexFilterBuilder);
        }

        if (element instanceof Text) {
            return new TextComponent(element, this.complexFilterBuilder, this.canvasRenderer);
        }

        throw new Error("Element not found");
    }

    createFragmentComponents(element: BaseElement): IElementComponent | undefined {
        if (element instanceof Text) {
            return new TextComponent(element, this.complexFilterBuilder, this.canvasRenderer);
        }
    }
}
