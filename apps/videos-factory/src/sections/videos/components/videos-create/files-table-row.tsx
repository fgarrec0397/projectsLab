import {
    Button,
    Checkbox,
    IconButton,
    MenuItem,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import FileThumbnail from "@/components/file-thumbnail";
import Iconify from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import { IFileManager } from "@/types/file";

type Props = {
    row: IFileManager;
    selected?: boolean;
    onSelectRow?: (event: React.MouseEvent<HTMLElement, MouseEvent>, fileId: string) => void;
    onRemoveFile?: (fileId: string) => void;
};

export default function FilesTableRow({ row, selected, onSelectRow, onRemoveFile }: Props) {
    const { id, name, type } = row;

    const confirm = useBoolean();

    const popover = usePopover();

    return (
        <>
            <TableRow selected={selected}>
                {onSelectRow && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={selected}
                            onClick={(event) => onSelectRow?.(event, id)}
                        />
                    </TableCell>
                )}

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <FileThumbnail file={type} sx={{ width: 36, height: 36 }} />
                        <Tooltip title={name}>
                            <Typography
                                noWrap
                                variant="inherit"
                                sx={{
                                    maxWidth: 200,
                                    cursor: onSelectRow ? "pointer" : "default",
                                }}
                            >
                                {name}
                            </Typography>
                        </Tooltip>
                    </Stack>
                </TableCell>
                {onRemoveFile && (
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
                )}
            </TableRow>
            {onRemoveFile && (
                <>
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
                            Remove
                        </MenuItem>
                    </CustomPopover>
                    <ConfirmDialog
                        open={confirm.value}
                        onClose={confirm.onFalse}
                        title="Remove"
                        content="Are you sure want to remove it from the list?"
                        action={
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => onRemoveFile?.(id)}
                            >
                                Remove
                            </Button>
                        }
                    />
                </>
            )}
        </>
    );
}
