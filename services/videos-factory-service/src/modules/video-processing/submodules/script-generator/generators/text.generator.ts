import { format, getRandomNumber } from "@projectslab/helpers";
import OpenAI from "openai";
import { OpenAIModule } from "src/common/OpenAI";
import { IVideo } from "src/modules/videos/videos.types";

export class TextGenerator {
    openAi: OpenAI;

    constructor(private readonly video: IVideo) {
        this.openAi = OpenAIModule.getModule();
    }

    async generateText(): Promise<string> {
        const promptOptions = await this.generatePromptOptions();
        const seed = this.generateSeed();
        const date = format(new Date(), "PPPP p");

        const result = await this.openAi.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                        We are ${date} and your job is to write a concise and precise text for a targeted audience on a subject.
                        To do so, you will receive a name (name of the text), a location (where the text should happen),  an age range (of the targeted audience), a gender (of the targeted audience), a language (in which the text should be written in), maybe some interests (of the targeted audience), maybe some challenges (that the targeted audience are facing), a topic (the topic of the text), a specificity level (if the text should appeal a broader audience or not), a structure type (of your text. Eg a vlog, quick tips, etc), a pace (pace of the text) and maybe more specificities (more instruction about how the text should be formatted). 
                        
                        The text should last 30 seconds when read loudly
                        
                        No titles nor subtitles, only plain text
                        
                        Use “Global English” to make content and context accessible for non-native comprehension. Don’t use idioms. Be literal and stay away from metaphors and colloquial language. Keep sentences short. Standardize terminology to minimize changes. Avoid directional language. Use inclusive, accessible, person-first language.
                    `,
                },
                { role: "user", content: promptOptions },
            ],
            model: "gpt-4",
            seed,
        });

        console.log("Returned result from OpenAI: ", JSON.stringify(result));

        return result.choices[0].message.content || "";
    }

    private async generatePromptOptions(): Promise<string> {
        const subjectsCount = this.getSubjectsCountBasedOnStructureType();
        const minAge = getRandomNumber(this.video[0], this.video[1]);
        const maxAge = getRandomNumber(minAge, this.video[1] + 1);
        const ageRange = `${minAge} and ${maxAge}`;
        const date = format(new Date(), "PPPP p");
        const gender = this.getGender();
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

        const options = `
            name: ${this.video.name},
            location: ${locations},
            age: ${ageRange},
            gender: ${gender},
            language: ${this.video.language},
            interests: ${this.video.interests},
            topic: ${this.video.topic},
            specificityLevel: ${this.video.specificityLevel},
            structureType: ${this.video.structureType},
            moreSpecificities: ${this.video.moreSpecificities}
        `;

        return options;
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
            gender = "women";
        }

        if (gender === "all") {
            gender = "man and/or women";
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
