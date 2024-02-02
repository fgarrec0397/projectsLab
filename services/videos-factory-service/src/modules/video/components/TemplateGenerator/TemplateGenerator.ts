import OpenAI from "openai";

import { FileSystem } from "../../../../common/FileSystem";
import { OpenAIModule } from "../../../../common/OpenAI";
import S3StorageManager from "../../../../common/S3StorageManager";
import { Template } from "../../videoTypes";
import { Script } from "../ScriptManager/ScriptManager";
import { BaseElement } from "../VideoRenderer/Entities/BaseElement";
import { SourceableElementConfig } from "../VideoRenderer/Entities/SourceableElement";
import { VideoRenderer } from "../VideoRenderer/VideoRenderer";
import { TemplatePromptBuilder } from "./Builders/TemplatePromptBuilder";

export type BaseTemplateData = {
    script: Script;
};

export type MappedFetchedAsset = {
    id: string | null | undefined;
    name: string | null | undefined;
    type: string | null | undefined;
    url: string | null | undefined;
};

export type TemplateAIElement = SourceableElementConfig;

export class TemplateGenerator<T extends BaseTemplateData = BaseTemplateData> {
    templateElements: TemplateAIElement[] | undefined;

    mappedFetchedAssets: MappedFetchedAsset[] | undefined = [];

    openAi: OpenAI;

    storageManager: S3StorageManager;

    templatePromptBuilder: TemplatePromptBuilder;

    data?: T;

    constructor() {
        this.openAi = OpenAIModule.getModule();
        this.storageManager = new S3StorageManager();
        this.templatePromptBuilder = new TemplatePromptBuilder();
    }

    async createTemplate() {
        await this.fetchAvailableAssets();
        await this.generateTemplateByAI();

        const template = this.mapAITemplateElementsToTemplateElements();

        console.log(JSON.stringify(template), "Created template");

        return template;
    }

    setTemplateData(data?: T) {
        this.data = data;
    }

    private async fetchAvailableAssets() {
        const filesList = await this.storageManager.listFiles("assets");

        this.mappedFetchedAssets = filesList?.map((x) => ({
            id: x.Key,
            name: S3StorageManager.extractFileName(x.Key),
            type: S3StorageManager.getFileExtension(x.Key),
            url: this.storageManager.getSignedFileUrl(x.Key),
        }));

        console.log(JSON.stringify(filesList), "TemplateGenerator filesList");
        console.log(this.mappedFetchedAssets, "this.mappedFetchedAssets");
    }

    private async generateTemplateByAI() {
        this.templatePromptBuilder
            .addSystemPrompt(
                `You are a video editor and your job is to create a video based
                on the script that will be given to you. The script will be formatted as following: "The first sentence. (start: 0, end: 12), The second sentence. (start: 12, end: 20)"
                You will also be provided with a list of mp4
                videos and maybe mp3 audio. The videos and audios lists will be formatted as follow: name: video_name.mp4, url: the/aws/s3/url/path/video_name.mp4?additionalparam1=paramvalues1&additionalparam2=paramvalues2 | name: video_name.mp4, url: the/aws/s3/url/path/video_name.mp4, etc.
                Base your asset choice by the name. The name should match as much as possible with the script. You should output the whole asset url in the sourcePath field. Your task is to generate a json that that will follow the
                given structure to create that video. You will choose which asset you want to appear in the video
                as long as some sound effect if there is any. The json should be formatted as follow: 
                {
                    "elements": [
                        {
                            "type": "video",
                            "name": "video_name.mp4",
                            "sourcePath": "the/aws/s3/url/path/video_name.mp4?additionalparam1=paramvalues1&additionalparam2=paramvalues2",
                            "start": 0,
                            "end": 10
                        },
                        {
                            "type": "audio",
                            "name": "audio_name.mp3",
                            "sourcePath": "the/aws/s3/url/path/audio_name.mp3?additionalparam1=paramvalues1&additionalparam2=paramvalues2",
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
                `The list of all available assets links are the following: ${this.printAssets()}`
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

            this.templateElements = JSON.parse(resultContent).elements.map(
                (x: SourceableElementConfig) => ({
                    ...x,
                    track: 1,
                })
            );

            console.log(resultContent, "resultContent returned by AI");
        } catch (error) {
            console.log(error);
        }
    }

    private mapAITemplateElementsToTemplateElements() {
        const elements = (this.templateElements
            ?.map((x) => {
                if (x.type === "video") {
                    return new VideoRenderer.Video(x);
                }

                if (x.type === "audio") {
                    return new VideoRenderer.Audio(x);
                }
            })
            .filter((x) => x !== undefined && x !== null) || []) as BaseElement[];

        elements.push(
            new VideoRenderer.Audio({
                name: "audio1",
                sourcePath: FileSystem.getAssetsPath("speech.mp3"),
                isVideoLengthHandler: true,
            }),
            new VideoRenderer.Text({
                name: "text",
                value: this.data?.script?.subtitles,
            })
        );

        const template: Template = {
            fps: 60,
            outputFormat: "mp4",
            width: 1080,
            height: 1920,
            elements,
        };

        return template;
    }

    private printAssets() {
        const assetsArray: string[] = [];

        this.mappedFetchedAssets?.forEach((x) => {
            if (typeof x.url !== "string" && typeof x.name !== "string") {
                return;
            }

            assetsArray.push(`name: ${x.name}, url: ${x.url}`);
        });

        console.log(assetsArray.join(" | "), "printed assets");

        return assetsArray.join(" | ");
    }

    private printTimedSentence() {
        const timedSentenceTextArray: string[] = [];

        this.data?.script?.sentences?.forEach((x) => {
            timedSentenceTextArray.push(`${x.sentence} (start: ${x.start}, end: ${x.end})`);
        });

        return timedSentenceTextArray.join(", ");
    }
}
