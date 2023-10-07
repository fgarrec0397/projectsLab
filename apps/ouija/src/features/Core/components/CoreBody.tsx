"use client";

import { HasChildren } from "@projectslab/helpers";
import { Paper, PaperProps } from "@projectslab/ui";
import { FC } from "react";

type Props = HasChildren;

type CoreBodyStyles = {
    body?: PaperProps;
};

const styles: CoreBodyStyles = {
    body: {
        sx: (theme) => ({
            backgroundColor: theme.palette.background.default,
            cursor: "none",
        }),
    },
};

const CoreBody: FC<Props> = ({ children }) => {
    return (
        <Paper component="body" {...styles.body}>
            {children}
        </Paper>
    );
};

export default CoreBody;
