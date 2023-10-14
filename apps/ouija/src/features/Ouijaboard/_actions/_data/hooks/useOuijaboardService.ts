import { useCallback } from "react";

import { OuijaboardMessage } from "@/features/Ouijaboard/ouijaBoardTypes";

import { useOuijaboardContext } from "../providers/OuijaboardProvider";

export default () => {
    const { messages, setMessages, entityIndex, setEntityIndex } = useOuijaboardContext();

    const addMessage = useCallback(
        (newMessage: OuijaboardMessage) => {
            setMessages((prev) => {
                const newMessages = [...prev, newMessage];

                return newMessages;
            });
        },
        [setMessages]
    );

    const updateEntityIndex = useCallback(
        (entityValue: number) => {
            setEntityIndex(entityValue);
        },
        [setEntityIndex]
    );

    return {
        messages,
        addMessage,
        entityIndex,
        updateEntityIndex,
    };
};
