import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { OpenAIModule } from "src/common/OpenAI";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";
import { IVideo } from "src/modules/videos/videos.types";

import { Script } from "../script-generator/script-generator.service";
import { BaseElement } from "../video-renderer/entities/BaseElement";
import { SourceableElementConfig } from "../video-renderer/entities/SourceableElement";
import { VideoEntities } from "../video-renderer/entities/VideoEntities";
import { Template } from "../video-renderer/video-renderer.types";
import { TemplatePromptBuilder } from "./builders/template-prompt.builder";

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

@Injectable()
export class TemplateGeneratorService<T extends BaseTemplateData = BaseTemplateData> {
    speechFilePath: string | undefined;

    templateElements: TemplateAIElement[] | undefined;

    mappedFetchedAssets: MappedFetchedAsset[] | undefined = [];

    openAi: OpenAI;

    templatePromptBuilder: TemplatePromptBuilder;

    data?: T;

    video: IVideo;

    constructor(@InjectStorageConfig() private storageConfig: StorageConfig) {
        this.openAi = OpenAIModule.getModule();
        this.templatePromptBuilder = new TemplatePromptBuilder();
    }

    async createTemplate() {
        await this.fetchAvailableAssets();
        await this.generateTemplateByAI();

        const template = this.mapAITemplateElementsToTemplateElements();
        console.log(JSON.stringify(template), "Created template");

        return template;
    }

    prepareTemplate(script: Script, speechFilePath: string, video: IVideo) {
        this.data = { script } as T;
        this.speechFilePath = speechFilePath;
        this.video = video;
    }

    private async fetchAvailableAssets() {
        this.mappedFetchedAssets = this.video.files?.map((x) => ({
            id: x,
            name: this.storageConfig.getFileName(x),
            type: this.storageConfig.getFileExtension(x),
            url: this.storageConfig.getFileUrl(x),
        }));

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
                            "type": "video1",
                            "name": "video1_name.mp4",
                            "sourcePath": "the/aws/s3/url/path/video_name.mp4?additionalparam1=paramvalues1&additionalparam2=paramvalues2",
                            "start": 0,
                            "end": 10
                        },
                        {
                            "type": "video2",
                            "name": "video2_name.mp4",
                            "sourcePath": "the/aws/s3/url/path/video_name.mp4?additionalparam1=paramvalues1&additionalparam2=paramvalues2",
                            "start": 10,
                            "end": 13
                        },
                        {
                            "type": "audio",
                            "name": "audio_name.mp3",
                            "sourcePath": "the/aws/s3/url/path/audio_name.mp3?additionalparam1=paramvalues1&additionalparam2=paramvalues2",
                            "volume": 0.03,
                            "start": 0,
                            "end": 13
                        }
                    ]
                }
                The "end" property of each videos should match the "start" property of the video before as shown in the example. "start" of video1 matches "end" of video2
                End and start properties should not contain milliseconds. The "end" property of the last item of type video should be equal to ${this.data?.script?.duration}.
                If you decide to put a video, the type should be "video", "audio", when it is an audio file. The name should be the corresponding name of the video or audio you
                decided to put in the video.
                Audio assets should have a volume of 0.03
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
            model: "gpt-4-turbo-preview",
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
                    return new VideoEntities.Video(x);
                }

                if (x.type === "audio") {
                    return new VideoEntities.Audio(x);
                }
            })
            .filter((x) => x !== undefined && x !== null) || []) as BaseElement[];

        elements.push(
            new VideoEntities.Audio({
                name: "audio1",
                sourcePath: this.speechFilePath,
                isVideoLengthHandler: true,
                volume: 1.2,
            }),
            new VideoEntities.Text({
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
