"use client";

import { HasChildren } from "@projectslab/helpers";
import { Box, BoxProps } from "@ui/index";
import { FC } from "react";

import boardData from "./boardData";

type InteractiveOverlayStyles = {
    pointerContainer?: BoxProps;
    pointer?: BoxProps;
};

const styles: InteractiveOverlayStyles = {
    pointerContainer: {
        position: "absolute",
        width: 1344,
        height: 896,
    },
    pointer: {
        sx: {
            position: "relative",
            width: 10,
            height: 10,
            backgroundColor: "red",
        },
    },
};

const InteractiveOverlay: FC<HasChildren> = () => {
    return (
        <Box {...styles.pointerContainer}>
            {boardData.map((x) => {
                const letterStyles: BoxProps = {
                    ...styles.pointer,
                    sx: {
                        ...styles.pointer?.sx,
                        top: x.position[0],
                        left: x.position[1],
                    },
                };

                return <Box key={x.id} id={x.id} {...letterStyles} />;
            })}
        </Box>
    );
};

export default InteractiveOverlay;
