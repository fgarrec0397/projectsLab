import OpenAI from "openai";

import { FileSystem } from "../../../core/modules/FileSystem";
import { OpenAIModule } from "../../../core/modules/OpenAI";
import StorageManager from "../../../core/modules/StorageManager/StorageManager";
import { Template } from "../../videoTypes";
import { Script } from "../ScriptManager/ScriptManager";
import { TemplatePromptBuilder } from "./Builders/TemplatePromptBuilder";

export type BaseTemplateData = {
    script: Script;
};

export type TemplateCallback = <T extends BaseTemplateData = BaseTemplateData>(
    data?: T
) => Template | undefined;

export type MappedFetchedAsset = {
    id: string | null | undefined;
    name: string | null | undefined;
    type: string | null | undefined;
};

// TODO - better name this type  + better type it (type and name properties)
export type TemplateAIElement = {
    type: string;
    name: string;
    start: number;
    end: number;
};

export class TemplateGenerator<T extends BaseTemplateData = BaseTemplateData> {
    templateElements: TemplateAIElement[] | undefined;

    mappedFetchedAssets: MappedFetchedAsset[] | undefined = [];

    openAi: OpenAI;

    storageManager: StorageManager;

    templatePromptBuilder: TemplatePromptBuilder;

    data?: T;

    constructor() {
        this.openAi = OpenAIModule.getModule();
        this.storageManager = new StorageManager();
        this.templatePromptBuilder = new TemplatePromptBuilder();
    }

    async createTemplate(templateCallback: TemplateCallback) {
        await this.fetchAvailableAssets();
        await this.generateTemplateByAI();
        await this.downloadNeededAssets();

        // const template = templateCallback(this.data);
        // console.log(JSON.stringify(template), "template");

        return templateCallback(this.data);
    }

    setTemplateData(data?: T) {
        this.data = data;
    }

    private async fetchAvailableAssets() {
        const filesList = await this.storageManager.getAssets();

        this.mappedFetchedAssets = filesList.files?.map((x) => ({
            id: x.id,
            name: x.name,
            type: x.mimeType,
        }));

        console.log(JSON.stringify(filesList), "filesList");
        console.log(this.mappedFetchedAssets, "this.mappedFetchedAssets");
    }

    private async downloadNeededAssets() {
        const filesIds = this.templateElements
            ?.map((x) => {
                return this.mappedFetchedAssets?.find((asset) => asset.name === x.name)?.id;
            })
            .filter((x) => x !== undefined && x !== null) as string[];

        if (!filesIds?.length) {
            return;
        }

        this.storageManager.downloadFilesByIds(filesIds, FileSystem.getAssetsPath());
    }

    private async generateTemplateByAI() {
        this.templatePromptBuilder
            .addSystemPrompt(
                `You are a video editor and your job is to create a video based
                on the script that will be given to you. The script will be formatted as following: "The first sentence. (start: 0, end: 12), The second sentence. (start: 12, end: 20)"
                You will also be provided with a list of mp4
                videos and maybe mp3 audio, and your task is to generate a json that that will follow the
                given structure to create that video. You will choose which asset you want to appear in the video
                as long as some sound effect if there is any. The json should be formatted as follow: 
                {
                    "elements": [
                        {
                            "type": "video",
                            "name": "video_name.mp4",
                            "start": 0,
                            "end": 10
                        },
                        {
                            "type": "audio",
                            "name": "audio_name.mp3",
                            "start": 0,
                            "end": 10
                        }
                    ]
                }
                If you decide to put a video, the type should be "video", "audio", when it is an audio file. The name should
                be the corresponding name of the video or audio you decided to put in the video.
                You will also be provided by a duration that match the duration of the whole video. You can put
                as many videos or audios as you want, but it should have at least one video playing for the whole video. So the
                addition of the duration of each video should match the given duration of the final video.
                Your goal is to optimized the retention of the viewer to keep it engaged as long as possible.
        `
            )
            .addUserPrompt(
                `The list of all available assets are the following: ${this.printAssetsNames()}`
            )
            .addUserPrompt(`The script: ${this.printTimedSentence()}`).addUserPrompt(`
                The duration is ${this.data?.script?.duration} seconds.
        `);

        const messages = this.templatePromptBuilder.build();

        const result = await this.openAi.chat.completions.create({
            messages,
            model: "gpt-4-1106-preview",
            response_format: {
                type: "json_object",
            },
        });

        const resultContent = result.choices[0].message.content;
        try {
            if (!resultContent) {
                return;
            }

            this.templateElements = JSON.parse(resultContent).elements;

            console.log(resultContent, "resultContent returned by AI");
        } catch (error) {
            console.log(error);
        }
    }

    private printAssetsNames() {
        const assetsNamesTextArray: string[] = [];

        this.mappedFetchedAssets?.forEach((x) => {
            if (typeof x.name !== "string") {
                return;
            }
            assetsNamesTextArray.push(x.name);
        });

        return assetsNamesTextArray.join(", ");
    }

    private printTimedSentence() {
        const timedSentenceTextArray: string[] = [];

        this.data?.script?.sentences?.forEach((x) => {
            timedSentenceTextArray.push(`${x.sentence} (start: ${x.start}, end: ${x.end})`);
        });

        return timedSentenceTextArray.join(", ");
    }
}
