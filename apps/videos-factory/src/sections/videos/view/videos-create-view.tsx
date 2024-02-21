"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    inputBaseClasses,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid";
import { m } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { varHover } from "@/components/animate";
import { SecondaryButton } from "@/components/button";
import { TertiaryButton } from "@/components/button/tertiary-button";
import { ConfirmDialog } from "@/components/custom-dialog";
import EmptyContent from "@/components/empty-content";
import FormProvider, {
    RHFRadioGroup,
    RHFSelect,
    RHFSlider,
    RHFTextField,
} from "@/components/hook-form";
import { useSettingsContext } from "@/components/settings";
import { useSnackbar } from "@/components/snackbar";
import { useTable } from "@/components/table";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetOrCreateVideoDraft } from "@/services/videosService/hooks/useGetOrCreateVideoDraft";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";
import { IFile } from "@/types/file";

import FilesSelectorModal from "../components/files-selector-modal";
import FilesTable from "../components/files-table";

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
    const { enqueueSnackbar } = useSnackbar();
    const settings = useSettingsContext();
    const [isEditingVideoName, setIsEditingVideoName] = useState(false);
    const [files, setFiles] = useState<IFile[]>([]);
    const isFilesModalOpen = useBoolean();
    const isConfirmRemoveModalOpen = useBoolean();
    const [videoName, setVideoName] = useState("Your awesome video");
    const { videoDraft } = useGetOrCreateVideoDraft();
    const table = useTable();

    const NewVideoSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        location: Yup.string().required("Location is required"),
        age: Yup.array().of(Yup.number()),
        gender: Yup.string().default("all"),
        language: Yup.string().default("en-US"),
        interests: Yup.string(),
        chanllenges: Yup.string(),
        contentType: Yup.string().required(),
        specificityLevel: Yup.string().required(),
        structureType: Yup.string().required(),
        pace: Yup.string().required(),
        moreSpecificities: Yup.string(),
        files: Yup.array().of(Yup.string()),
    });

    const defaultValues = useMemo(
        () => ({
            name: "Your new awesome video",
            location: "",
            age: [18, 36],
            gender: "all",
            language: "en-US",
            interests: undefined,
            chanllenges: undefined,
            contentType: "",
            specificityLevel: "broader audience",
            structureType: "quick tips",
            pace: "mix",
            moreSpecificities: undefined,
            files: [],
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewVideoSchema),
        defaultValues,
    });

    const { reset, handleSubmit, control, setValue } = methods;

    useEffect(() => {
        setValue(
            "files",
            files.map((x) => x.id)
        );
    }, [files, files.length, setValue]);

    const onSaveDraft = () => {
        console.log({ formValues: control._formValues }, "control save draft");
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log(data, "data");

            reset();
            enqueueSnackbar("Video created with success!");
        } catch (error) {
            console.error(error);
        }
    });

    const onSelectFiles = (selectedFiles: IFile[]) => {
        isFilesModalOpen.onFalse();
        setFiles(selectedFiles);
    };

    const removeSelectedFromTable = () => {
        setFiles((prev) => {
            const filtered = prev.filter((x) => {
                const isSelected = table.selected.findIndex((item) => item === x.id) !== -1;

                return !isSelected;
            });
            return filtered;
        });

        table.resetSelected();
        isConfirmRemoveModalOpen.onFalse();
    };

    const onTableRemoveFile = (fileId: string) => {
        setFiles((prev) => {
            return prev.filter((x) => x.id !== fileId);
        });
    };

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
                                <TextField
                                    value={videoName}
                                    onChange={(event) => setVideoName(event.target.value)}
                                    fullWidth
                                    sx={{
                                        marginTop: pxToRem(-10),
                                        paddingTop: pxToRem(2),
                                        paddingBottom: pxToRem(2),
                                        [`&.${inputBaseClasses.root}`]: {
                                            // py: 0.75,
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
                                <Typography variant="h4"> {videoName} </Typography>
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
                            <SecondaryButton type="submit">Publish</SecondaryButton>
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
                                                name="chanllenges"
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
                            <Card sx={{ height: "100%" }}>
                                <CardHeader
                                    title="Assets"
                                    sx={{ mb: 2 }}
                                    action={
                                        <>
                                            {table.selected.length > 0 && (
                                                <Button onClick={isConfirmRemoveModalOpen.onTrue}>
                                                    Remove
                                                </Button>
                                            )}
                                            <Button onClick={isFilesModalOpen.onTrue}>Add</Button>
                                        </>
                                    }
                                />
                                <CardContent>
                                    {files.length ? (
                                        <FilesTable
                                            table={table}
                                            files={files}
                                            onRemoveFile={onTableRemoveFile}
                                        />
                                    ) : (
                                        <EmptyContent
                                            filled
                                            title="No Data"
                                            sx={{
                                                py: 10,
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
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
                                            <RHFSelect name="specificityLevel" label="Specificity">
                                                <MenuItem value="">None</MenuItem>
                                                <Divider sx={{ borderStyle: "dashed" }} />
                                                {SPECIFICITY_OPTIONS.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.label}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <RHFSelect name="structureType" label="Structure type">
                                                {STRUCTURE_TYPE_OPTIONS.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.label}
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
            <FilesSelectorModal
                isFilesModalOpen={isFilesModalOpen.value}
                onCloseFilesModal={isFilesModalOpen.onFalse}
                onSelectFiles={onSelectFiles}
            />
            <ConfirmDialog
                open={isConfirmRemoveModalOpen.value}
                onClose={isConfirmRemoveModalOpen.onFalse}
                title="Remove"
                content={`Are you sure want to remove ${table.selected.length} file${
                    table.selected.length > 1 ? "s" : ""
                } from the list?`}
                action={
                    <Button variant="contained" color="error" onClick={removeSelectedFromTable}>
                        Remove
                    </Button>
                }
            />
        </>
    );
}
