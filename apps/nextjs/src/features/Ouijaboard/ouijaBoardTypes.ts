import { ChatCompletionMessage } from "openai/resources/chat/index.mjs";

export type BoardPointer = {
    id: string;
    value: string;
    position: [number, number];
};

export type OuijaboardMessage = ChatCompletionMessage;
