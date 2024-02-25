import { Injectable, Scope } from "@nestjs/common";
import { format, getRandomNumber } from "@projectslab/helpers";
import OpenAI from "openai";
import { countries as allCountries } from "src/common/constants";
import { OpenAIModule } from "src/common/OpenAI";
import { IVideo } from "src/modules/videos/videosTypes";

import { TextGeneratorStrategy } from "./TextGeneratorStrategy";

type PromptOptions = {
    subjectsCount: number;
    ageRange: string;
    locations: string[];
    date: string;
};

@Injectable({ scope: Scope.REQUEST })
export class OpenAITextGeneratorStrategy implements TextGeneratorStrategy {
    openAi: OpenAI;

    countries: string[] = allCountries;

    constructor(private readonly video: IVideo) {
        console.log(this.video, "this.video in OpenAITextGeneratorStrategy");
        this.openAi = OpenAIModule.getModule();
    }

    async generateText(): Promise<string> {
        const promptOptions = await this.generatePrePromptOptions();
        const preprompt = this.generatePrePrompt(promptOptions);
        const seed = this.generateSeed();

        console.log(`Dynamic preprompt generated: ${preprompt}`);

        console.log(`Calling OpenAI with seed: ${seed}`);

        const prepromptResultCompletion = await this.openAi.chat.completions.create({
            messages: [
                { role: "system", content: preprompt[0] },
                { role: "user", content: preprompt[1] },
            ],
            model: "gpt-4",
            seed,
        });

        console.log("Returned pre-prompt from OpenAI: ", JSON.stringify(prepromptResultCompletion));

        const prepromptResult = prepromptResultCompletion.choices[0].message.content || "";

        const prompt = this.generatePrompt(prepromptResult);

        const result = await this.openAi.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4",
            seed,
        });

        console.log("Returned result from OpenAI: ", JSON.stringify(result));

        return result.choices[0].message.content || "";
    }

    private generatePrePrompt(options: PromptOptions): string[] {
        const { ageRange, locations, date, subjectsCount } = options;
        const locationsList = locations.join(", ");
        const gender = this.getGender();

        return [
            `You are someone that has automated your content by creating contents with the following niche: “${this.video.contentType}”.
            You need to create your next video and search for some ideas. We are ${date} and you are about to summarize briefly your next video of “${this.video.contentType}”.
            `,
            `
            Write me a script where the structure of the script is ${this.video.structureType} of ${subjectsCount} subjects that would interest a ${gender} that likes ${this.video.interests} of age between ${ageRange}
            that happens or is related to ${locationsList}. The audience faces ${this.video.challenges} as challenges and the script should appeal to a ${this.video.specificityLevel} audience;
            ${this.video.moreSpecificities}. The script should be written in ${this.video.language} with a ${this.video.pace} pace.
            This is a preprompt that will be used for another prompt`,
        ];
    }

    private async generatePrePromptOptions(): Promise<PromptOptions> {
        const subjectsCount = this.getSubjectsCountBasedOnStructureType();
        const minAge = getRandomNumber(this.video[0], this.video[1]);
        const maxAge = getRandomNumber(minAge, this.video[1] + 1);
        const ageRange = `${minAge} and ${maxAge}`;
        const date = format(new Date(), "PPPP p");
        const seed = this.generateSeed();

        const locationsResult = await this.openAi.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                        You will receive a location and a date and your job is to give me
                        ${subjectsCount} more precise location${
                            subjectsCount > 1 ? "s" : ""
                        } based on the given date. You should format your response following this
                        pattern: location1, location2, etc. If there is only one location, you should
                        avoid the ",".
                        A location can be a country, a state, but also a type of building such as restaurant.
                        To give you a good idea, if the location is a country, the response location should
                        be a state of this country, if it is a state, the response should be a city or a place
                        within this state, if it is a type of build, it should be a place in this building such
                        as a bathroom, restroom etc. You will need to determine which is the best a accurate location.
                    `,
                },
                {
                    role: "user",
                    content: `Location: ${this.video.location}. Date: ${date}`,
                },
            ],
            model: "gpt-4",
            seed,
        });

        const locations = locationsResult.choices[0].message.content
            .split(",")
            .filter((x) => x !== undefined && x !== null);

        return { ageRange, locations, date, subjectsCount };
    }

    private generatePrompt(preprompt: string) {
        return `
        [Context]=${preprompt}
        
        [Writting Sample]=Did you know the Mona Lisa doesn't have any eyebrows? Curiosities that you've never heard of. The last one almost no one can answer. You share your birthday with twenty million people. Comment your birthday and see who has the same as you. Doctors don't save your life, they just prolong it for more time. People who stay up late tend to be more intelligent than early sleepers. If you comment 'sulk', you unlock a secret emoji. The last person you think of before you go to sleep is either the source of your joy or your pain. You wanna see how much time you have spent here on TikTok? Share this video with your calculator and it will show you. Have you ever thought about how many pictures of unknown people you've appeared in? Liking and following me makes you smarter every day. Alright, here's the question that no one can solve. If everything is possible, then the impossible is possible.
        
        [Type]=${this.video.contentType}
        
        Task: Create a concise and precise [Type] text of the [Context] as subject. Use simple words that are easy to understand. Write in the same style, tone and tense as [Writing Sample].. Output a text about [Context] that could take 1 minute to read it loud. You should start by Did you know___ followed by the [Context] asked as a question.`;
    }

    private generateSeed() {
        const multiplier = Math.floor(Math.random() * 100);
        return Date.now() * multiplier;
    }

    private getGender() {
        let gender = this.video.gender as string;

        if (gender === "male") {
            gender = "man";
        }

        if (gender === "female") {
            gender = "girl";
        }

        if (gender === "all") {
            gender = "man and/or girl";
        }

        return gender;
    }

    private getSubjectsCountBasedOnStructureType() {
        let subjectsCountArray = [1, 1];

        if (this.video.structureType === "quickTips") {
            subjectsCountArray = [4, 6];
        }

        if (this.video.structureType === "storytelling") {
            subjectsCountArray = [1, 1];
        }

        if (this.video.structureType === "vlog") {
            subjectsCountArray = [1, 5];
        }

        if (this.video.structureType === "tops") {
            subjectsCountArray = [5, 8];
        }

        return getRandomNumber(subjectsCountArray[0], subjectsCountArray[1]);
    }
}
