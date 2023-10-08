import { Fetcher } from "@projectslab/helpers";
import { ChatCompletionMessage } from "openai/resources/chat/completions.mjs";
import { useCallback, useEffect, useState } from "react";

import { BoardElement, OuijaboardMessage } from "../../ouijaBoardTypes";
import useOuijaboardService from "../_data/hooks/useOuijaboardService";

export default () => {
    const { messages, updateMessages, isConnectionInit, updateConnection } = useOuijaboardService();
    const ouijaboardBaseURL = "/api/ouijaboard";

    const sendQuestion = useCallback(
        async (question: string) => {
            console.log({ messages }, "before send question");

            if (!isConnectionInit) {
                const confirmConnectionResponse = await Fetcher.post("/api/confirmConnection", {
                    question,
                });

                console.log(confirmConnectionResponse, "confirmConnectionResponse");
            }

            const newMessage: OuijaboardMessage = { role: "user", content: question };
            const messagesWithQuestion = [...messages, newMessage];
            console.log(messagesWithQuestion, "messagesWithQuestion");

            const questionResponse = await Fetcher.post(ouijaboardBaseURL, {
                messages: messagesWithQuestion,
            });
            console.log(questionResponse, "questionResponse");

            updateMessages(newMessage);
        },
        [messages, updateMessages]
    );

    const moveCursorTo = useCallback((idElement: string, cursor: HTMLElement) => {
        const currentElement = document.getElementById(idElement);
        const left = currentElement?.getBoundingClientRect().left;
        const top = currentElement?.getBoundingClientRect().top;

        if (!cursor || !left || !top) {
            return;
        }

        cursor.style.transition = "left 0.3s ease, top 0.3s ease";
        cursor.style.left = `${left}px`;
        cursor.style.top = `${top}px`;
    }, []);

    const initCursorMovement = useCallback(
        async (cursor: HTMLElement, lettersArray: BoardElement[]) => {
            const movementsPromises: Promise<void>[] = [];

            lettersArray.forEach(async (letter, index) => {
                movementsPromises.push(
                    new Promise<void>((resolve) => {
                        setTimeout(() => {
                            moveCursorTo(letter.id, cursor);
                            resolve();
                        }, index * 3000);
                    })
                );
            });

            await Promise.all(movementsPromises);
        },
        [moveCursorTo]
    );

    return {
        messages,
        moveCursorTo,
        initCursorMovement,
        sendQuestion,
    };
};
