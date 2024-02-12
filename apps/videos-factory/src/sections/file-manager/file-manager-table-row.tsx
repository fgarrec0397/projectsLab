import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";

import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import FileThumbnail from "@/components/file-thumbnail";
import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";
import { useBoolean } from "@/hooks/use-boolean";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useDoubleClick } from "@/hooks/use-double-click";
import { IFileManager } from "@/types/file";
import { fData } from "@/utils/format-number";
import { fDate, fTime } from "@/utils/format-time";

import FileManagerFileDetails from "./file-manager-file-details";
import { useFolderNavigation } from "./hooks/use-folder-navigation";

// ----------------------------------------------------------------------

type Props = {
    row: IFileManager;
    selected: boolean;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
    const theme = useTheme();

    const { goTo } = useFolderNavigation();

    const { name, size, type, modifiedAt } = row;

    const { enqueueSnackbar } = useSnackbar();

    const { copy } = useCopyToClipboard();

    const details = useBoolean();

    const confirm = useBoolean();

    const popover = usePopover();

    const handleClick = useDoubleClick({
        click: () => {
            details.onTrue();
        },
        doubleClick: () => {
            goTo(row.path);
        },
    });

    const handleCopy = useCallback(() => {
        enqueueSnackbar("Copied!");
        copy(row.url);
    }, [copy, enqueueSnackbar, row.url]);

    const defaultStyles = {
        borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        "&:first-of-type": {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
        "&:last-of-type": {
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
    };

    return (
        <>
            <TableRow
                selected={selected}
                sx={{
                    borderRadius: 2,
                    [`&.${tableRowClasses.selected}, &:hover`]: {
                        backgroundColor: "background.paper",
                        boxShadow: theme.customShadows.z20,
                        transition: theme.transitions.create(["background-color", "box-shadow"], {
                            duration: theme.transitions.duration.shortest,
                        }),
                        "&:hover": {
                            backgroundColor: "background.paper",
                            boxShadow: theme.customShadows.z20,
                        },
                    },
                    [`& .${tableCellClasses.root}`]: {
                        ...defaultStyles,
                    },
                    ...(details.value && {
                        [`& .${tableCellClasses.root}`]: {
                            ...defaultStyles,
                        },
                    }),
                }}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={selected}
                        onDoubleClick={() => console.info("ON DOUBLE CLICK")}
                        onClick={onSelectRow}
                    />
                </TableCell>

                <TableCell onClick={handleClick}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <FileThumbnail file={type} sx={{ width: 36, height: 36 }} />

                        <Typography
                            noWrap
                            variant="inherit"
                            sx={{
                                maxWidth: 360,
                                cursor: "pointer",
                                ...(details.value && { fontWeight: "fontWeightBold" }),
                            }}
                        >
                            {name}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell onClick={handleClick} sx={{ whiteSpace: "nowrap" }}>
                    {fData(size)}
                </TableCell>

                <TableCell onClick={handleClick} sx={{ whiteSpace: "nowrap" }}>
                    {type}
                </TableCell>

                <TableCell onClick={handleClick} sx={{ whiteSpace: "nowrap" }}>
                    <ListItemText
                        primary={fDate(modifiedAt)}
                        secondary={fTime(modifiedAt)}
                        primaryTypographyProps={{ typography: "body2" }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: "span",
                            typography: "caption",
                        }}
                    />
                </TableCell>
                <TableCell
                    align="right"
                    sx={{
                        px: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    <IconButton
                        color={popover.open ? "inherit" : "default"}
                        onClick={popover.onOpen}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 160 }}
            >
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
                item={row}
                onCopyLink={handleCopy}
                open={details.value}
                onClose={details.onFalse}
                onDelete={onDeleteRow}
            />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
