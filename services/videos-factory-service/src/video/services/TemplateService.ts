import { Script } from "../modules/ScriptManager/ScriptManager";
import {
    TemplateCallback,
    TemplateGenerator,
} from "../modules/TemplateGenerator/TemplateGenerator";
import templates from "../templates/templates";

export class TemplateService {
    private templateGenerator: TemplateGenerator;

    private templateKey: keyof typeof templates | undefined;

    constructor(templateGenerator: TemplateGenerator) {
        this.templateGenerator = templateGenerator;
    }

    createTemplate() {
        if (!this.templateKey) {
            throw new Error("TemplateService.prepareTemplate method has not been called");
        }

        const templateCallback = templates[this.templateKey] as TemplateCallback;
        const template = this.templateGenerator.createTemplate(templateCallback);

        return template;
    }

    prepareTemplate(templateKey: keyof typeof templates, script: Script) {
        this.templateKey = templateKey;

        this.templateGenerator.setTemplateData({
            script,
        });
    }
}
