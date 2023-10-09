import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getOpenAiApiKey } from "@/config/envConfig";
import { getAnalysingQuestionPrompt } from "@/config/promptsConfig";

const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

export const POST = async (request: Request) => {
    const requestJson = await request.json();
    const requestMessages = requestJson.question;
    const prompt = getAnalysingQuestionPrompt(requestMessages, "if there is someone here");

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-3.5-turbo",
    });

    const responseValue = chatCompletion.choices[0].message.content?.toLowerCase().includes("yes");

    return NextResponse.json(responseValue, { status: 200 });
};
