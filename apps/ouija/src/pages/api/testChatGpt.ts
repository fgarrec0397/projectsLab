import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ResponseData = {
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices[0].message, "chatCompletion message");

    res.status(200).json({ message: "Hello from Next.js!" });
}
