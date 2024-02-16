"use client";

import { Button, IconButton, inputBaseClasses, Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";
import { useState } from "react";

import { varHover } from "@/components/animate";
import { useSettingsContext } from "@/components/settings";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";

// ----------------------------------------------------------------------

export default function VideosCreateView() {
    const settings = useSettingsContext();
    const [isEditingVideoName, setIsEditingVideoName] = useState(false);
    const [videoName, setVideoName] = useState("Your awesome video");

    return (
        <Container maxWidth={settings.themeStretch ? false : "xl"}>
            <Stack direction="row" alignItems="center">
                {isEditingVideoName ? (
                    <TextField
                        value={videoName}
                        onChange={(event) => setVideoName(event.target.value)}
                        sx={{
                            [`&.${inputBaseClasses.root}`]: {
                                py: 0.75,
                                borderRadius: 1,
                                typography: "h4",
                                borderWidth: 2,
                                borderStyle: "solid",
                                borderColor: "transparent",
                                transition: (theme) =>
                                    theme.transitions.create(["padding-left", "border-color"]),
                                [`&.${inputBaseClasses.focused}`]: {
                                    pl: 1.5,
                                    borderColor: "text.primary",
                                },
                            },
                            [`& .${inputBaseClasses.input}`]: {
                                typography: "h6",
                            },
                        }}
                    />
                ) : (
                    <Typography variant="h4"> {videoName} </Typography>
                )}

                {isEditingVideoName ? (
                    <Button
                        variant="soft"
                        onClick={() => setIsEditingVideoName(false)}
                        sx={{
                            marginLeft: pxToRem(5),
                        }}
                    >
                        Save
                    </Button>
                ) : (
                    <IconButton
                        component={m.button}
                        whileTap="tap"
                        whileHover="hover"
                        variants={varHover(1.05)}
                        aria-label="settings"
                        onClick={() => setIsEditingVideoName(true)}
                        sx={{
                            width: pxToRem(36),
                            height: pxToRem(36),
                            marginLeft: pxToRem(7),
                            marginTop: pxToRem(-3),
                        }}
                    >
                        {icon("pen", { width: 24 })}
                    </IconButton>
                )}
            </Stack>

            <Box
                sx={{
                    mt: 5,
                    width: 1,
                    height: 320,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                    border: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
            />
        </Container>
    );
}
