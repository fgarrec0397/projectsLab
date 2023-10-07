import { useCallback } from "react";

import { OuijaboardMessage } from "@/features/Ouijaboard/ouijaBoardTypes";

import { useOuijaboardContext } from "../providers/OuijaboardProvider";

export default () => {
    const { messages, setMessages } = useOuijaboardContext();

    const updateMessages = useCallback(
        (newMessage: OuijaboardMessage) => {
            setMessages((prev) => {
                const newMessages = [...prev, newMessage];

                return newMessages;
            });
        },
        [setMessages]
    );

    return {
        messages,
        updateMessages,
    };
};
