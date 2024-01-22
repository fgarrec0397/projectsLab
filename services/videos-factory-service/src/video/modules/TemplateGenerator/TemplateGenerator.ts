import OpenAI from "openai";

import { OpenAIModule } from "../../../core/modules/OpenAI";
import StorageManager from "../../../core/modules/StorageManager";
import { Template, TimedText } from "../../videoTypes";
import { TemplatePromptBuilder } from "./Builders/TemplatePromptBuilder";

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

    private async generateTemplateByAI() {
        this.templatePromptBuilder
            .addSystemPrompt(`You are a video editor and your job is to create a video based
        on the script that will be given to you. You will also be provided with a list of mp4
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
        `).addUserPrompt(`
        The list of all available assets are the following: suprised_person_1.mp4, happy_person_1.mp4, earth_from_space_1.mp4
        statisfying_video_1.mp4, statisfying_video_2.mp4, statisfying_video_3.mp4, random_vide01, yolo.mp4, minecraft_parcour_1.mp4, minecraft_parcour_2.mp4,
        minecraft_parcour_3.mp4, minecraft_parcour_4.mp4, bang_soundeffect.mp3, pow_soundeffect.mp3, this_is_so_nice.mp3
        `).addUserPrompt(`
        The script: 
        [Section1] Did you know honey never spoils? That's right! Archaeologists have unearthed pots of honey in ancient Egyptian tombs over 3,000 years old, and it's still good to eat.
        
        [Section2] Ever heard about octopuses and their hearts? They have three! Two pump blood to the gills, and the other to the rest of the body.
        
        [Section3] What do you call a group of flamingos? A "flamboyance". Now that's a flashy name!
        
        [Section4] The shortest war ever? It happened between Britain and Zanzibar on August 27, 1896, and lasted just 38 minutes!
        
        [Section5] Here's a berry interesting fact: Bananas are berries, but strawberries aren't. In the botanical world, a berry comes from a single flower's ovary and has seeds in its flesh.
        
        [Section6] The Eiffel Tower grows taller in the summer – up to 15 cm! This happens because the iron expands in the heat.
        
        [Section7] Trees vs. stars – Earth has over 3 trillion trees, more than the stars in the Milky Way, which only has between 100-400 billion.
        
        [Section8] Cows have best friends too! They can even get stressed if they're separated.
        
        [Section9] Walter Morrison, the inventor of the Frisbee, became a Frisbee himself after he died – his ashes were made into one in 2010.
        
        [Section10] A "jiffy" is more than just a saying – it's a real unit of time, meaning 1/100th of a second.
        `).addUserPrompt(`
        The duration is 72 seconds.
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

            const templateJson = JSON.parse(resultContent);

            console.log(templateJson, "templateJson");
        } catch (error) {
            console.log(error);
        }
    }
}
