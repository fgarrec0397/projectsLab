import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CardProps } from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import FileThumbnail from "@/components/file-thumbnail";
import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";
import TextMaxLine from "@/components/text-max-line";
import { useBoolean } from "@/hooks/use-boolean";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useDoubleClick } from "@/hooks/use-double-click";
import { renameFile } from "@/services/filesService/filesService";
import { IFileManager } from "@/types/file";
import { fData } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";

import FileManagerFileDetails from "./file-manager-file-details";
import FileManagerNewFolderDialog from "./file-manager-new-folder-dialog";
import { useFolderNavigation } from "./hooks/use-folder-navigation";

// ----------------------------------------------------------------------

interface Props extends CardProps {
    file: IFileManager;
    selected?: boolean;
    onSelect?: VoidFunction;
    onDelete: VoidFunction;
}

export default function FileManagerFileItem({
    file,
    selected,
    onSelect,
    onDelete,
    sx,
    ...other
}: Props) {
    const { user } = useAuthContext();

    const { goTo } = useFolderNavigation();

    const { enqueueSnackbar } = useSnackbar();

    const { copy } = useCopyToClipboard();

    const [fileName, setFileName] = useState(file.name);

    const editFile = useBoolean();

    const checkbox = useBoolean();

    const confirm = useBoolean();

    const details = useBoolean();

    const popover = usePopover();

    const handleClick = useDoubleClick({
        click: () => {
            details.onTrue();
        },
        doubleClick: () => {
            goTo(file.path);
        },
    });

    const handleChangeFileName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    }, []);

    const handleCopy = useCallback(() => {
        enqueueSnackbar("Copied!");
        copy(file.url);
    }, [copy, enqueueSnackbar, file.url]);

    const handleRenameFile = async () => {
        editFile.onFalse();
        setFileName(fileName);

        await renameFile(user?.accessToken, file.path, fileName);
    };

    const renderIcon =
        (checkbox.value || selected) && onSelect ? (
            <Checkbox
                size="medium"
                checked={selected}
                onClick={onSelect}
                icon={<Iconify icon="eva:radio-button-off-fill" />}
                checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                sx={{ p: 0.75 }}
            />
        ) : (
            <FileThumbnail file={file.type} sx={{ width: 36, height: 36 }} />
        );

    const renderAction = (
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: "absolute" }}>
            <IconButton color={popover.open ? "inherit" : "default"} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
        </Stack>
    );

    const renderText = (
        <>
            <TextMaxLine
                persistent
                variant="subtitle2"
                onClick={details.onTrue}
                sx={{ width: 1, mt: 2, mb: 0.5 }}
            >
                {file.name}
            </TextMaxLine>

            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    maxWidth: 0.99,
                    whiteSpace: "nowrap",
                    typography: "caption",
                    color: "text.disabled",
                }}
            >
                {fData(file.size)}

                <Box
                    component="span"
                    sx={{
                        mx: 0.75,
                        width: 2,
                        height: 2,
                        flexShrink: 0,
                        borderRadius: "50%",
                        bgcolor: "currentColor",
                    }}
                />
                <Typography noWrap component="span" variant="caption">
                    {fDateTime(file.modifiedAt)}
                </Typography>
            </Stack>
        </>
    );

    return (
        <>
            <Stack
                component={Paper}
                variant="outlined"
                alignItems="flex-start"
                onClick={handleClick}
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: "unset",
                    cursor: "pointer",
                    position: "relative",
                    ...((checkbox.value || selected) && {
                        bgcolor: "background.paper",
                        boxShadow: (theme) => theme.customShadows.z20,
                    }),
                    ...sx,
                }}
                {...other}
            >
                <Box onMouseEnter={checkbox.onTrue} onMouseLeave={checkbox.onFalse}>
                    {renderIcon}
                </Box>

                {renderText}

                {renderAction}
            </Stack>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 160 }}
            >
                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        editFile.onTrue();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <Divider sx={{ borderStyle: "dashed" }} />

                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: "error.main" }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

            <FileManagerFileDetails
                item={file}
                onCopyLink={handleCopy}
                open={details.value}
                onClose={details.onFalse}
                onDelete={() => {
                    details.onFalse();
                    onDelete();
                }}
            />

            <FileManagerNewFolderDialog
                open={editFile.value}
                onClose={editFile.onFalse}
                title="Edit Folder"
                onUpdate={handleRenameFile}
                folderName={fileName}
                onChangeFolderName={handleChangeFileName}
            />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
