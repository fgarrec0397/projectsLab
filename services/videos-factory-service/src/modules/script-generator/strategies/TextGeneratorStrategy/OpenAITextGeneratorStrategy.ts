import { Injectable } from "@nestjs/common";
import { format, getRandomNumber } from "@projectslab/helpers";
import OpenAI from "openai";
import { countries as allCountries } from "src/common/constants";
import { OpenAIModule } from "src/common/OpenAI";
import { IVideo } from "src/modules/videos/videosTypes";

import { TextGeneratorStrategy } from "./TextGeneratorStrategy";

type PromptOptions = {
    factCount: number;
    ageRange: string;
    countries: string[];
    date: string;
};

@Injectable()
export class OpenAITextGeneratorStrategy implements TextGeneratorStrategy {
    openAi: OpenAI;

    countries: string[] = allCountries;

    constructor() {
        this.openAi = OpenAIModule.getModule();
    }

    async generateText(video: IVideo): Promise<string> {
        const promptOptions = this.generatePrePromptOptions(video);
        const preprompt = this.generatePrePrompt(promptOptions);
        const multiplier = Math.floor(Math.random() * 100);
        const seed = Date.now() * multiplier;

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
        const { factCount, ageRange, countries, date } = options;
        const countryList = countries.join(", ");

        return [
            `You are someone that has automated your content by creating contents with the following niche: “Some general fun facts compilation that no one would ever know before”.
            You need to create your next video and search for some ideas. We are ${date} and you are about to summarize briefly your next video of “Some general fun facts compilation that 
            no one would ever know before”.
            `,
            `
            Write me ${factCount} facts that would interest a [tiktok viewer] of age between ${ageRange} that happened in ${countryList}. Just write a simple and concise statement for 
            each fact. This is a preprompt that will be used for another prompt`,
        ];
    }

    private getRandomCountries(count: number): string[] {
        return Array.from(
            { length: count },
            () => this.countries[getRandomNumber(0, allCountries.length - 1)]
        );
    }

    private generatePrePromptOptions(video: IVideo): PromptOptions {
        const factCount = getRandomNumber(4, 10);
        const minAge = getRandomNumber(15, 75); // 75 as upper limit to ensure maxAge <= 80
        const maxAge = getRandomNumber(minAge, 80);
        const ageRange = `${minAge} and ${maxAge}`;
        const countries = this.getRandomCountries(factCount);
        const date = format(new Date(), "PPPP p");

        return { factCount, ageRange, countries, date };
    }

    private generatePrompt(preprompt: string) {
        return `
        [Context]=${preprompt}
        
        [Writting Sample]=Did you know the Mona Lisa doesn't have any eyebrows? Curiosities that you've never heard of. The last one almost no one can answer. You share your birthday with twenty million people. Comment your birthday and see who has the same as you. Doctors don't save your life, they just prolong it for more time. People who stay up late tend to be more intelligent than early sleepers. If you comment 'sulk', you unlock a secret emoji. The last person you think of before you go to sleep is either the source of your joy or your pain. You wanna see how much time you have spent here on TikTok? Share this video with your calculator and it will show you. Have you ever thought about how many pictures of unknown people you've appeared in? Liking and following me makes you smarter every day. Alright, here's the question that no one can solve. If everything is possible, then the impossible is possible.
        
        [Type]=Some general fun facts compilation that no one would ever know before”
        
        Task: Create a concise and precise [Type] text of the [Context] as subject. Use simple words that are easy to understand. Write in the same style, tone and tense as [Writing Sample].. Output a text about [Context] that could take 1 minute to read it loud. You should start by Did you know___ followed by the [Context] asked as a question.`;
    }
}
