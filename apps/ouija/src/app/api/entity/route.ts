import { NextResponse } from "next/server";

import { openai } from "@/config/openAiConfig";
import { getAnalysingQuestionPrompt } from "@/config/promptsConfig";
import entities from "@/data/entities";

export const getRandomIndex = <TArrayValue>(array: TArrayValue[]) => {
    const randomIndex = Math.floor(Math.random() * array.length);

    return randomIndex;
};

export const POST = async (request: Request) => {
    const requestJson = await request.json();
    const requestMessages = requestJson.question;
    const questionPrompt = getAnalysingQuestionPrompt(requestMessages, "if there is someone here");

    console.log("POST called");

    const questionChatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: questionPrompt,
            },
        ],
        model: "gpt-3.5-turbo",
    });

    const isQuestionValid = questionChatCompletion.choices[0].message.content
        ?.toLowerCase()
        .includes("yes");

    const entityIndex = getRandomIndex(entities);

    const response = isQuestionValid ? entityIndex : isQuestionValid;

    return NextResponse.json(response, { status: 200 });
};
