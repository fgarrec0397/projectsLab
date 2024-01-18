import { TemplateGenerator } from "../modules/TemplateGenerator/TemplateGenerator";
import templates from "../templates/templates";

export class TemplateService {
    private templateGenerator: TemplateGenerator;

    constructor(templateGenerator: TemplateGenerator) {
        this.templateGenerator = templateGenerator;
    }

    createTemplate(templateKey: keyof typeof templates, data: any) {
        this.templateGenerator.setData(data);

        const templateCallback = templates[templateKey];
        const template = this.templateGenerator.createTemplate(templateCallback);

        return template;
    }
}
