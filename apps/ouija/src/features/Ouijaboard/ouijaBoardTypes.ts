import { ChatCompletionMessage } from "openai/resources/chat/index.mjs";

export type BoardElement = {
    id: string;
    value: string;
    position: [number, number];
};

export type OuijaboardMessage = ChatCompletionMessage;
