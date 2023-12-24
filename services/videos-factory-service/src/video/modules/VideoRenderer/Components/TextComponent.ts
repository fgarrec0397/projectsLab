import { Text } from "../Entities/Text";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class TextComponent extends BaseComponent<Text> implements IElementComponent {
    process(): void {
        const text = this.element;

        if (!text) {
            return;
        }

        console.log(text, "text");
    }
}
