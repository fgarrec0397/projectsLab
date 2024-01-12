import { Template } from "../../videoTypes";

export class TemplateGenerator<T> {
    data: T;

    constructor(data: T) {
        this.data = data;
    }

    createTemplate(templateCallback: (data: T) => Template) {
        return templateCallback(this.data);
    }
}
