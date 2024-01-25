import { Script } from "../modules/ScriptManager/ScriptManager";
import { TemplateGenerator } from "../modules/TemplateGenerator/TemplateGenerator";

export class TemplateService {
    private templateGenerator: TemplateGenerator;

    constructor(templateGenerator: TemplateGenerator) {
        this.templateGenerator = templateGenerator;
    }

    createTemplate() {
        const template = this.templateGenerator.createTemplate();

        return template;
    }

    prepareTemplate(script: Script) {
        this.templateGenerator.setTemplateData({
            script,
        });
    }
}
