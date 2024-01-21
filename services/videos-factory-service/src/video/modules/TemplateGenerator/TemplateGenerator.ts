import { Template, TimedText } from "../../videoTypes";

export type BaseTemplateData = {
    script: TimedText[];
};

export type TemplateCallback = <T extends BaseTemplateData = BaseTemplateData>(
    data?: T
) => Template | undefined;

export class TemplateGenerator<T extends BaseTemplateData = BaseTemplateData> {
    data?: T;

    createTemplate(templateCallback: TemplateCallback) {
        return templateCallback(this.data);
    }

    setTemplateData(data?: T) {
        this.data = data;
    }
}
