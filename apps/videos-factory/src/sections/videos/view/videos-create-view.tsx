"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    inputBaseClasses,
    MenuItem,
    Stack,
} from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid";
import { m } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { useAuthContext } from "@/auth/hooks";
import { varHover } from "@/components/animate";
import { SecondaryButton } from "@/components/button";
import { TertiaryButton } from "@/components/button/tertiary-button";
import FormProvider, {
    RHFRadioGroup,
    RHFSelect,
    RHFSlider,
    RHFTextField,
} from "@/components/hook-form";
import RHFFilesSelector from "@/components/hook-form/rhf-files-selector";
import { LoadingScreen } from "@/components/loading-screen";
import { useSettingsContext } from "@/components/settings";
import { useSnackbar } from "@/components/snackbar";
import { useGetFiles } from "@/services/filesService/hooks/useGetFiles";
import { useGetOrCreateVideoDraft } from "@/services/videosService/hooks/useGetOrCreateVideoDraft";
import { saveDraft, startRendering } from "@/services/videosService/videosService";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";
import { IFormVideo } from "@/types/video";

// ----------------------------------------------------------------------

const SPECIFICITY_OPTIONS = [
    { value: "broader", label: "Broader audience" },
    { value: "specific", label: "Specific audience" },
];

const STRUCTURE_TYPE_OPTIONS = [
    { value: "quickTips", label: "Quick tips" },
    { value: "storytelling", label: "Storytelling" },
    { value: "vlog", label: "Vlog" },
    { value: "tops", label: "Tops" },
];

export default function VideosCreateView() {
    const auth = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const settings = useSettingsContext();
    const { allFiles } = useGetFiles();
    const [isEditingVideoName, setIsEditingVideoName] = useState(false);
    const { videoDraft, isVideoDraftLoading } = useGetOrCreateVideoDraft();

    const NewVideoSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        location: Yup.string().required("Location is required"),
        age: Yup.array().of(Yup.number().required()).required("Age is required"),
        gender: Yup.string().required("Gender is required").default("all"),
        language: Yup.string().required("Language is required").default("en-US"),
        interests: Yup.string(),
        challenges: Yup.string(),
        contentType: Yup.string().required(),
        specificityLevel: Yup.string().required(),
        structureType: Yup.string().required(),
        pace: Yup.string().required(),
        moreSpecificities: Yup.string(),
        files: Yup.array()
            .of(Yup.string().required())
            .min(1, "You must have at least one file for you video")
            .required("Files are required"),
    });

    const defaultValues = useMemo<IFormVideo>(() => {
        return {
            name: "Your new awesome video",
            location: "",
            age: [18, 36],
            gender: "all",
            language: "en-US",
            interests: undefined,
            challenges: undefined,
            contentType: "",
            specificityLevel: SPECIFICITY_OPTIONS[0].value,
            structureType: STRUCTURE_TYPE_OPTIONS[0].value,
            pace: "mix",
            moreSpecificities: undefined,
            files: [],
        };
    }, []);

    const methods = useForm<IFormVideo>({
        resolver: yupResolver(NewVideoSchema),
        defaultValues,
    });

    const { reset, handleSubmit, control } = methods;

    useEffect(() => {
        if (videoDraft) {
            reset({
                ...defaultValues,
                ...videoDraft,
            });
        }
    }, [videoDraft, reset, defaultValues]);

    const onSaveDraft = async () => {
        try {
            await saveDraft(auth.user?.accessToken, {
                ...control._formValues,
                documentId: videoDraft?.documentId,
            });
            enqueueSnackbar("Video draft saved with success!");
        } catch (error) {
            enqueueSnackbar("The video draft was not saved correctly", { variant: "error" });
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        console.log(data, "data");
        try {
            await startRendering(auth.user?.accessToken, data);

            reset();
            enqueueSnackbar("Video created with success!");
        } catch (error) {
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    });

    if (isVideoDraftLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Container maxWidth={settings.themeStretch ? false : "xl"}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            mb: { xs: 3, md: 5 },
                        }}
                    >
                        {isEditingVideoName ? (
                            <Stack direction="row" alignItems="center">
                                <RHFTextField
                                    name="name"
                                    fullWidth
                                    sx={{
                                        marginTop: pxToRem(-10),
                                        paddingTop: pxToRem(2),
                                        paddingBottom: pxToRem(2),
                                        [`&.${inputBaseClasses.root}`]: {
                                            borderRadius: 1,
                                            typography: "h4",
                                            borderWidth: 2,
                                            borderStyle: "solid",
                                            borderColor: "transparent",
                                            transition: (theme) =>
                                                theme.transitions.create([
                                                    "padding-left",
                                                    "border-color",
                                                ]),
                                            [`&.${inputBaseClasses.focused}`]: {
                                                pl: 1.5,
                                                borderColor: "text.primary",
                                            },
                                        },
                                        [`& .${inputBaseClasses.input}`]: {
                                            typography: "h4",
                                        },
                                    }}
                                />
                                <Button
                                    variant="soft"
                                    onClick={() => setIsEditingVideoName(false)}
                                    sx={{
                                        marginLeft: pxToRem(5),
                                    }}
                                >
                                    Save
                                </Button>
                            </Stack>
                        ) : (
                            <Stack direction="row" alignItems="center">
                                <Typography variant="h4"> {control._formValues.name} </Typography>
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
                            </Stack>
                        )}
                        <Stack direction="row">
                            <TertiaryButton onClick={onSaveDraft} sx={{ mr: 1 }}>
                                Save Draft
                            </TertiaryButton>
                            <SecondaryButton type="submit">Start rendering</SecondaryButton>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <Card>
                                <CardHeader title="Target audience" sx={{ mb: 2 }} />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid xs={12} md={8}>
                                            <RHFTextField
                                                name="location"
                                                label="Location"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid xs={12} md={4}>
                                            <RHFSlider name="age" helperText="Age range" />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <RHFRadioGroup
                                                name="gender"
                                                label="Gender"
                                                row
                                                options={[
                                                    { label: "Male", value: "male" },
                                                    { label: "Female", value: "female" },
                                                    { label: "All", value: "all" },
                                                ]}
                                            />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <RHFTextField
                                                name="language"
                                                label="Language"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <RHFTextField
                                                name="interests"
                                                label="Hobbies, interests, preferences"
                                                fullWidth
                                                multiline
                                                minRows={3}
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <RHFTextField
                                                name="challenges"
                                                label="What challenges are they facing?"
                                                fullWidth
                                                multiline
                                                minRows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFFilesSelector name="files" label="Assets" files={allFiles} />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Card>
                                <CardHeader title="Content" sx={{ mb: 2 }} />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid xs={12} md={6}>
                                            <RHFTextField
                                                name="contentType"
                                                label="Type of content"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <RHFSelect
                                                name="specificityLevel"
                                                label="Specificity"
                                                defaultValue={SPECIFICITY_OPTIONS[0].value}
                                            >
                                                {SPECIFICITY_OPTIONS.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <RHFSelect
                                                name="structureType"
                                                label="Structure type"
                                                defaultValue={STRUCTURE_TYPE_OPTIONS[0].value}
                                            >
                                                {STRUCTURE_TYPE_OPTIONS.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <RHFRadioGroup
                                                name="pace"
                                                label="Pace"
                                                row
                                                options={[
                                                    { label: "Slow", value: "slow" },
                                                    { label: "Fast", value: "fast" },
                                                    { label: "Mix", value: "mix" },
                                                ]}
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <RHFTextField
                                                name="moreSpecificities"
                                                label="More specificities"
                                                fullWidth
                                                multiline
                                                minRows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </FormProvider>
        </>
    );
}