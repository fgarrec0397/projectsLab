"use client";

import { HasChildren } from "@projectslab/helpers";
import { Box, BoxProps } from "@ui/index";
import { FC } from "react";

import boardData from "./boardData";

type InteractiveOverlayStyles = {
    pointerStyle?: BoxProps;
};

const styles: InteractiveOverlayStyles = {
    pointerStyle: {
        sx: {
            position: "absolute",
            width: 10,
            height: 10,
            backgroundColor: "red",
        },
    },
};

const InteractiveOverlay: FC<HasChildren> = () => {
    return (
        <>
            {boardData.map((x) => {
                const letterStyles: BoxProps = {
                    ...styles.pointerStyle,
                    sx: {
                        ...styles.pointerStyle?.sx,
                        top: x.position[0],
                        left: x.position[1],
                    },
                };

                return <Box key={x.id} id={x.id} {...letterStyles} />;
            })}
        </>
    );
};

export default InteractiveOverlay;
