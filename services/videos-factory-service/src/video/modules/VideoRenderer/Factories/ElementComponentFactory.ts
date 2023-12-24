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
    complexFilterBuilder: ComplexFilterBuilder;

    constructor(complexFilterBuilder: ComplexFilterBuilder) {
        this.complexFilterBuilder = complexFilterBuilder;
    }

    createElementComponent(element: BaseElement): IElementComponent {
        if (element instanceof Composition) {
            // TODO - the issue is here
            const childComponents = element.elements.map(this.createElementComponent);
            return new CompositionComponent(element, childComponents, this.complexFilterBuilder);
        } else if (element instanceof Video) {
            return new VideoComponent(element, this.complexFilterBuilder);
        } else if (element instanceof Audio) {
            return new AudioComponent(element, this.complexFilterBuilder);
        } else if (element instanceof Text) {
            return new TextComponent(element, this.complexFilterBuilder);
        }
        throw new Error("Unknown element type");
    }
}
