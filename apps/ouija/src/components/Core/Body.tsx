"use client";

import { HasChildren } from "@projectslab/helpers";
import { Paper, PaperProps } from "@projectslab/ui";
import { FC } from "react";

type BodyStyles = {
    body?: PaperProps;
};

const styles: BodyStyles = {
    body: {
        sx: (theme) => ({
            backgroundColor: theme.palette.background.default,
        }),
    },
};

const Body: FC<HasChildren> = ({ children }) => {
    return (
        <Paper component="body" {...styles.body}>
            {children}
        </Paper>
    );
};

export default Body;
