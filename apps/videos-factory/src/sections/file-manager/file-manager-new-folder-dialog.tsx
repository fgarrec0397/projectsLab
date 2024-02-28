import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { PrimaryButton } from "@/components/button";
import { TertiaryButton } from "@/components/button/tertiary-button";
import Iconify from "@/components/iconify";
import { LoadingScreen } from "@/components/loading-screen";
import { useSnackbar } from "@/components/snackbar";
import { Upload } from "@/components/upload";
import { useBoolean } from "@/hooks/use-boolean";
import { uploadFiles } from "@/services/filesService/filesService";
import { getErrorMessage } from "@/utils/axios";

// ----------------------------------------------------------------------

interface Props extends DialogProps {
    title?: string;
    showUpload?: boolean;
    //
    onCreate?: VoidFunction;
    onUpdate?: VoidFunction;
    //
    folderName?: string;
    onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //
    open: boolean;
    onClose: VoidFunction;
}

export default function FileManagerNewFolderDialog({
    title = "Upload Files",
    showUpload = true,
    open,
    onClose,
    //
    onCreate,
    onUpdate,
    //
    folderName,
    onChangeFolderName,
    ...other
}: Props) {
    const isUpload = showUpload && !(onCreate || onUpdate);

    const { user } = useAuthContext();
    const [files, setFiles] = useState<File[]>([]);
    const hasFiles = useMemo(() => files.length > 0, [files]);
    const { enqueueSnackbar } = useSnackbar();
    const isFilesUploading = useBoolean();

    useEffect(() => {
        if (!open) {
            setFiles([]);
        }
    }, [open]);

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            setFiles([...files, ...newFiles]);
        },
        [files]
    );

    const handleUpload = async () => {
        if (!files.length) {
            return;
        }

        try {
            enqueueSnackbar(`Uploading ${files.length} item${files.length > 1 ? "s" : ""}`, {
                variant: "info",
            });

            isFilesUploading.onTrue();

            await uploadFiles(user?.accessToken, undefined, files);

            isFilesUploading.onFalse();

            onClose();

            enqueueSnackbar(
                `${files.length} item${files.length > 1 ? "s" : ""} uploaded with success`,
                {
                    variant: "success",
                }
            );
        } catch (error: any) {
            enqueueSnackbar(getErrorMessage(error) || "An error occured while uploading", {
                variant: "error",
                persist: true,
            });
        }
    };

    const handleRemoveFile = (inputFile: File | string) => {
        const filtered = files.filter((file) => file !== inputFile);
        setFiles(filtered);
    };

    const handleRemoveAllFiles = () => {
        onClose();
        setFiles([]);
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

            <DialogContent dividers sx={{ pt: 1, pb: 0, border: "none" }}>
                {isFilesUploading.value && <LoadingScreen fullWidth />}

                {(onCreate || onUpdate) && (
                    <TextField
                        fullWidth
                        label="Folder name"
                        value={folderName}
                        onChange={onChangeFolderName}
                        sx={{ mb: 3 }}
                    />
                )}
                {isUpload && (
                    <Upload
                        multiple
                        files={files}
                        onDrop={handleDrop}
                        onRemove={handleRemoveFile}
                    />
                )}
            </DialogContent>

            <DialogActions>
                <TertiaryButton onClick={handleRemoveAllFiles}>Cancel</TertiaryButton>
                {!!files.length && (
                    <TertiaryButton onClick={handleRemoveAllFiles}>Remove all</TertiaryButton>
                )}

                {isUpload && (
                    <PrimaryButton
                        variant="contained"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={handleUpload}
                        disabled={!hasFiles}
                    >
                        Upload
                    </PrimaryButton>
                )}

                {(onCreate || onUpdate) && (
                    <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
                        <PrimaryButton onClick={onCreate || onUpdate}>
                            {onUpdate ? "Save" : "Create"}
                        </PrimaryButton>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
}
