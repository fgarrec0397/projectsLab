"use client";

import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { PropsWithChildren, ReactNode } from "react";

import { LoadingScreen } from "@/components/loading-screen";
import { useSettingsContext } from "@/components/settings";

// ----------------------------------------------------------------------

type Props = PropsWithChildren & {
    title: ReactNode;
    titleItem?: ReactNode;
    subContent?: ReactNode;
    isLoading?: boolean;
};

export default function PageWrapper({ title, titleItem, subContent, isLoading, children }: Props) {
    const settings = useSettingsContext();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : "xl"}>
            <Stack
                {...(titleItem
                    ? {
                          direction: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                      }
                    : {})}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            >
                {typeof title === "string" ? (
                    <Typography variant="h3"> {title} </Typography>
                ) : (
                    title
                )}
                {titleItem !== undefined && <Stack direction="row">{titleItem}</Stack>}
            </Stack>
            <Stack>
                {subContent !== undefined && (
                    <Stack
                        spacing={2.5}
                        sx={{
                            mb: { xs: 3, md: 5 },
                        }}
                    >
                        {subContent}
                    </Stack>
                )}
                {children}
            </Stack>
        </Container>
    );
}
