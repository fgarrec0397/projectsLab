import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FileThumbnail, { fileFormat } from "@/components/file-thumbnail";
import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import { useBoolean } from "@/hooks/use-boolean";
import { IFile } from "@/types/file";
import { fData } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = DrawerProps & {
    item: IFile;
    //
    onCopyLink: VoidFunction;
    //
    onClose: VoidFunction;
    onDelete: VoidFunction;
};

export default function FileManagerFileDetails({
    item,
    open,
    //
    onCopyLink,
    onClose,
    onDelete,
    ...other
}: Props) {
    const { name, size, url, type, modifiedAt } = item;

    const properties = useBoolean(true);

    const renderProperties = (
        <Stack spacing={1.5}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ typography: "subtitle2" }}
            >
                Properties
                <IconButton size="small" onClick={properties.onToggle}>
                    <Iconify
                        icon={
                            properties.value
                                ? "eva:arrow-ios-upward-fill"
                                : "eva:arrow-ios-downward-fill"
                        }
                    />
                </IconButton>
            </Stack>

            {properties.value && (
                <>
                    <Stack
                        direction="row"
                        sx={{ typography: "caption", textTransform: "capitalize" }}
                    >
                        <Box component="span" sx={{ width: 80, color: "text.secondary", mr: 2 }}>
                            Size
                        </Box>
                        {fData(size)}
                    </Stack>

                    <Stack
                        direction="row"
                        sx={{ typography: "caption", textTransform: "capitalize" }}
                    >
                        <Box component="span" sx={{ width: 80, color: "text.secondary", mr: 2 }}>
                            Modified
                        </Box>
                        {fDateTime(modifiedAt)}
                    </Stack>

                    <Stack
                        direction="row"
                        sx={{ typography: "caption", textTransform: "capitalize" }}
                    >
                        <Box component="span" sx={{ width: 80, color: "text.secondary", mr: 2 }}>
                            Type
                        </Box>
                        {fileFormat(type)}
                    </Stack>
                </>
            )}
        </Stack>
    );

    return (
        <>
            <Drawer
                open={open}
                onClose={onClose}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: { width: 320 },
                }}
                {...other}
            >
                <Scrollbar sx={{ height: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ p: 2.5 }}
                    >
                        <Typography variant="h6"> Info </Typography>
                    </Stack>

                    <Stack
                        spacing={2.5}
                        justifyContent="center"
                        sx={{
                            p: 2.5,
                            bgcolor: "background.neutral",
                        }}
                    >
                        <FileThumbnail
                            imageView
                            file={type === "folder" ? type : url}
                            sx={{ width: 64, height: 64 }}
                            imgSx={{ borderRadius: 1 }}
                        />

                        <Typography variant="subtitle1" sx={{ wordBreak: "break-all" }}>
                            {name}
                        </Typography>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        {renderProperties}
                    </Stack>
                </Scrollbar>

                <Box sx={{ p: 2.5 }}>
                    <Button
                        fullWidth
                        variant="soft"
                        color="error"
                        size="large"
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}
