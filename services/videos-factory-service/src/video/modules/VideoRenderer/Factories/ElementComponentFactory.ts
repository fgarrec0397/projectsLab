import { AudioComponent } from "../Components/AudioComponent";
import { CompositionComponent } from "../Components/CompositionComponent";
import { IElementComponent } from "../Components/IElementComponent";
import { TextComponent } from "../Components/TextComponent";
import { VideoComponent } from "../Components/VideoComponent";
import { Audio } from "../Entities/Audio";
import { BaseElement } from "../Entities/BaseElement";
import { Composition } from "../Entities/Composition";
import { Text } from "../Entities/Text";
import { Video } from "../Entities/Video";

export class ElementComponentFactory {
    static createElementComponent(element: BaseElement): IElementComponent {
        if (element instanceof Composition) {
            const childComponents = element.elements.map(
                ElementComponentFactory.createElementComponent
            );
            return new CompositionComponent(childComponents);
        } else if (element instanceof Video) {
            return new VideoComponent(element);
        } else if (element instanceof Audio) {
            return new AudioComponent(element);
        } else if (element instanceof Text) {
            return new TextComponent(element);
        }
        throw new Error("Unknown element type");
    }
}
