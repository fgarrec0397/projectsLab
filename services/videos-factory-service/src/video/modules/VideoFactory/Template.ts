type TemplateConfig = {
    duration: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    elements: any[]; // TODO - Build the other elements type before handling this
};

export class Template {
    constructor(config: TemplateConfig) {
        console.log(config, "Template constructor");
    }
}
