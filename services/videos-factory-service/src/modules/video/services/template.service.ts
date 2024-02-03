import { Injectable } from "@nestjs/common";

import { Script } from "../components/ScriptManager/ScriptManager";
import { TemplateGenerator } from "../components/TemplateGenerator/TemplateGenerator";

@Injectable()
export class TemplateService {
    constructor(private readonly templateGenerator: TemplateGenerator) {}

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
