import { useCallback } from "react";

import { OuijaboardMessage } from "@/features/Ouijaboard/ouijaBoardTypes";

import { useOuijaboardContext } from "../providers/OuijaboardProvider";

export default () => {
    const { messages, setMessages, isConnectionInit, setIsConnectionInit } = useOuijaboardContext();

    const updateMessages = useCallback(
        (newMessage: OuijaboardMessage) => {
            setMessages((prev) => {
                const newMessages = [...prev, newMessage];

                return newMessages;
            });
        },
        [setMessages]
    );

    const updateConnection = useCallback(
        (value: boolean) => {
            setIsConnectionInit(value);
        },
        [setIsConnectionInit]
    );

    return {
        messages,
        updateMessages,
        isConnectionInit,
        updateConnection,
    };
};
