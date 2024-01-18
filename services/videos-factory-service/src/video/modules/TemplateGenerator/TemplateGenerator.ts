import { Template } from "../../videoTypes";

export class TemplateGenerator<T = any> {
    data?: T;

    createTemplate(templateCallback: (data?: T) => Template) {
        return templateCallback(this.data);
    }

    setData(data?: T) {
        this.data = data;
    }
}
