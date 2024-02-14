import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CardProps } from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useCallback, useState } from "react";

import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";
import { useBoolean } from "@/hooks/use-boolean";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useDoubleClick } from "@/hooks/use-double-click";
import { IFolderManager } from "@/types/file";

import FileManagerFileDetails from "./file-manager-file-details";
import FileManagerNewFolderDialog from "./file-manager-new-folder-dialog";
import { useFolderNavigation } from "./hooks/use-folder-navigation";

// ----------------------------------------------------------------------

interface Props extends CardProps {
    folder: IFolderManager;
    selected?: boolean;
    onSelect?: VoidFunction;
    onDelete: VoidFunction;
}

export default function FileManagerFolderItem({
    folder,
    selected,
    onSelect,
    onDelete,
    sx,
    ...other
}: Props) {
    const { goTo } = useFolderNavigation();

    const { enqueueSnackbar } = useSnackbar();

    const { copy } = useCopyToClipboard();

    const [folderName, setFolderName] = useState(folder.name);

    const editFolder = useBoolean();

    const checkbox = useBoolean();

    const share = useBoolean();

    const popover = usePopover();

    const confirm = useBoolean();

    const details = useBoolean();

    const handleClick = useDoubleClick({
        doubleClick: () => {
            goTo(folder.path);
        },
    });

    const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(event.target.value);
    }, []);

    const handleCopy = useCallback(() => {
        enqueueSnackbar("Copied!");
        copy(folder.url);
    }, [copy, enqueueSnackbar, folder.url]);

    const renderAction = (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                top: 8,
                right: 8,
                position: "absolute",
            }}
        >
            <IconButton color={popover.open ? "inherit" : "default"} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
        </Stack>
    );

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
            <Box
                component="img"
                src="/assets/icons/files/ic_folder.svg"
                sx={{ width: 36, height: 36 }}
            />
        );

    const renderText = (
        <ListItemText
            onClick={details.onTrue}
            primary={folder.name}
            secondary={folder.totalFiles !== undefined && <>{folder.totalFiles} files</>}
            primaryTypographyProps={{
                noWrap: true,
                typography: "subtitle1",
            }}
            secondaryTypographyProps={{
                mt: 0.5,
                component: "span",
                alignItems: "center",
                typography: "caption",
                color: "text.disabled",
                display: "inline-flex",
            }}
        />
    );

    return (
        <>
            <Stack
                component={Paper}
                variant="outlined"
                spacing={1}
                alignItems="flex-start"
                onClick={handleClick}
                sx={{
                    p: 2.5,
                    maxWidth: 222,
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

                {renderAction}

                {renderText}
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
                        handleCopy();
                    }}
                >
                    <Iconify icon="eva:link-2-fill" />
                    Copy Link
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        share.onTrue();
                    }}
                >
                    <Iconify icon="solar:share-bold" />
                    Share
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        editFolder.onTrue();
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
                item={folder}
                onCopyLink={handleCopy}
                open={details.value}
                onClose={details.onFalse}
                onDelete={() => {
                    details.onFalse();
                    onDelete();
                }}
            />

            <FileManagerNewFolderDialog
                open={editFolder.value}
                onClose={editFolder.onFalse}
                title="Edit Folder"
                onUpdate={() => {
                    editFolder.onFalse();
                    setFolderName(folderName);
                    console.info("UPDATE FOLDER", folderName);
                }}
                folderName={folderName}
                onChangeFolderName={handleChangeFolderName}
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
