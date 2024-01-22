import StorageManager from "../../../core/modules/StorageManager";
import { Template, TimedText } from "../../videoTypes";

export type BaseTemplateData = {
    script: TimedText[];
};

export type TemplateCallback = <T extends BaseTemplateData = BaseTemplateData>(
    data?: T
) => Template | undefined;

export type MappedFetchedAsset = {
    name: string | null | undefined;
    type: string | null | undefined;
};

export class TemplateGenerator<T extends BaseTemplateData = BaseTemplateData> {
    mappedFetchedAssets: MappedFetchedAsset[] | undefined = [];

    storageManager: StorageManager;

    data?: T;

    constructor() {
        this.storageManager = new StorageManager();
    }

    async createTemplate(templateCallback: TemplateCallback) {
        // await this.fetchAvailableAssets();

        const template = templateCallback(this.data);
        console.log(JSON.stringify(template), "template");

        return templateCallback(this.data);
    }

    setTemplateData(data?: T) {
        this.data = data;
    }

    private async fetchAvailableAssets() {
        const filesList = await this.storageManager.getAssets();

        this.mappedFetchedAssets = filesList.files?.map((x) => ({
            name: x.name,
            type: x.mimeType,
        }));

        console.log(JSON.stringify(filesList), "filesList");
        console.log(this.mappedFetchedAssets, "this.mappedFetchedAssets");
    }

    // private async
}
