import { Fetcher } from "@projectslab/helpers";
import { useCallback } from "react";

import { BoardElement } from "../../ouijaBoardTypes";

export default () => {
    const initOuijaboard = useCallback(async () => {
        console.log("initOuijaboard");

        const messagesResponse = await Fetcher.get("/api/ouijaboard");
        const messagesData = await messagesResponse.data;
        console.log(messagesData, "messagesData");
    }, []);

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
        initOuijaboard,
        moveCursorTo,
        initCursorMovement,
    };
};
