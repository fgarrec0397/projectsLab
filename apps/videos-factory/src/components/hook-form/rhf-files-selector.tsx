import { Button, FormHelperText, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useBoolean } from "@/hooks/use-boolean";
import FilesSelectorModal from "@/sections/videos/components/videos-create/files-selector-modal";
import { IFile } from "@/types/file";

import { ConfirmDialog } from "../custom-dialog";
import FilesTableCard from "../files-table-card/files-table-card";
import { useTable } from "../table";

// ----------------------------------------------------------------------

type Props = {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
    files: IFile[];
};

export default function RHFFilesSelector({ name, label, helperText, files }: Props) {
    const { control, clearErrors, setValue } = useFormContext();
    const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
    const isFilesModalOpen = useBoolean();
    const isConfirmRemoveModalOpen = useBoolean();
    const table = useTable();

    useEffect(() => {
        const filesToInit = files.filter(
            (x) => (control._formValues[name] as string[]).findIndex((y) => y === x.id) !== -1
        );

        if (!filesToInit.length) {
            return;
        }

        setSelectedFiles(filesToInit);
    }, [files, control._formValues, name]);

    useEffect(() => {
        setValue(
            name,
            selectedFiles.map((x) => x.id)
        );
    }, [selectedFiles, selectedFiles.length, name, setValue]);

    const onSelectFiles = (newSelectedFiles: IFile[]) => {
        setSelectedFiles((prev) => {
            const combinedFiles = [...prev, ...newSelectedFiles];
            const uniqueFiles = Array.from(new Set(combinedFiles.map((file) => file.id))).map(
                (id) => combinedFiles.find((file) => file.id === id)!
            );

            return uniqueFiles;
        });

        clearErrors(name);
        isFilesModalOpen.onFalse();
    };

    const removeSelectedFromTable = () => {
        setSelectedFiles((prev) => {
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
        setSelectedFiles((prev) => {
            return prev.filter((x) => x.id !== fileId);
        });
    };

    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ fieldState: { error } }) => (
                    <FilesTableCard
                        title={
                            <Stack>
                                {label}
                                {(!!error || helperText) && (
                                    <FormHelperText error={!!error} sx={{ mx: 0 }}>
                                        {error ? error?.message : helperText}
                                    </FormHelperText>
                                )}
                            </Stack>
                        }
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
                        table={table}
                        files={selectedFiles}
                        onRemoveFile={onTableRemoveFile}
                    />
                )}
            />
            <FilesSelectorModal
                isFilesModalOpen={isFilesModalOpen.value}
                files={files}
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
