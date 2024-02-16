import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { PrimaryButton } from "@/components/button";
import { TertiaryButton } from "@/components/button/tertiary-button";
import Iconify from "@/components/iconify";
import { Upload } from "@/components/upload";
import { uploadFiles } from "@/services/filesService/filesService";

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
    const isUploading = showUpload && !(onCreate || onUpdate);

    const { user } = useAuthContext();
    const [files, setFiles] = useState<File[]>([]);

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
        onClose();

        await uploadFiles(user?.accessToken, undefined, files);
    };

    const handleRemoveFile = (inputFile: File | string) => {
        const filtered = files.filter((file) => file !== inputFile);
        setFiles(filtered);
    };

    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

            <DialogContent dividers sx={{ pt: 1, pb: 0, border: "none" }}>
                {(onCreate || onUpdate) && (
                    <TextField
                        fullWidth
                        label="Folder name"
                        value={folderName}
                        onChange={onChangeFolderName}
                        sx={{ mb: 3 }}
                    />
                )}

                {isUploading && (
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

                {isUploading && (
                    <PrimaryButton
                        variant="contained"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={handleUpload}
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
