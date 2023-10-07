import { Fetcher } from "@projectslab/helpers";
import { useCallback, useEffect, useState } from "react";

import { BoardElement, OuijaboardMessage } from "../../ouijaBoardTypes";
import useOuijaboardService from "../_data/hooks/useOuijaboardService";

export default () => {
    const { messages, updateMessages } = useOuijaboardService();
    const [isInitCalled, setIsInitCalled] = useState(false);
    const ouijaboardBaseURL = "/api/ouijaboard";

    useEffect(() => {
        console.log(messages, "messages useEffect");
    }, [messages]);

    const initOuijaboard = useCallback(async () => {
        if (isInitCalled) {
            return;
        }

        const messageResponse = await Fetcher.get<void, OuijaboardMessage>(ouijaboardBaseURL);

        updateMessages(messageResponse);
        setIsInitCalled(true);
    }, [isInitCalled, updateMessages]);

    const sendQuestion = useCallback(
        async (question: string) => {
            console.log({ messages }, "before send question");

            const messagesWithQuestion = [...messages, { role: "user", content: question }];
            const questionResponse = await Fetcher.post(ouijaboardBaseURL, {
                messages: messagesWithQuestion,
            });
            console.log(questionResponse, "questionResponse");
        },
        [messages]
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
        initOuijaboard,
        moveCursorTo,
        initCursorMovement,
        sendQuestion,
    };
};
