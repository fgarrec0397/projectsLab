import { Card, IconButton, Link, MenuItem, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import CustomPopover, { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import Image from "@/components/image";
import Label from "@/components/label";
import { useResponsive } from "@/hooks/use-responsive";
import { RouterLink } from "@/routes/components";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";
import { IVideo } from "@/types/video";

type Props = {
    video: IVideo;
};

export default function VideosListVideoCard({ video }: Props) {
    const popover = usePopover();
    const smUp = useResponsive("up", "sm");

    return (
        <>
            <Stack component={Card} direction="row">
                {smUp && (
                    <Box
                        sx={{
                            width: 180,
                            height: 240,
                            position: "relative",
                            flexShrink: 0,
                            p: 1,
                        }}
                    >
                        <Image
                            alt="title"
                            src="https://placehold.co/600x400"
                            sx={{ height: 1, borderRadius: 1.5 }}
                        />
                    </Box>
                )}
                <Stack
                    sx={{
                        width: 1,
                        p: (theme) => theme.spacing(3, 3, 2, 3),
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                    >
                        <Box
                            component="span"
                            sx={{ typography: "caption", color: "text.disabled" }}
                        >
                            August 30, 2023
                        </Box>
                        <Label variant="soft" color="default">
                            {video.status}
                        </Label>
                    </Stack>

                    <Stack spacing={1} flexGrow={1}>
                        <Link color="inherit" component={RouterLink} href="#">
                            <Typography variant="h5">{video.name}</Typography>
                        </Link>

                        <Stack direction="row" alignItems="center" sx={{ color: "text.disabled" }}>
                            {icon("stopwatch", { width: 18 })}
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: pxToRem(14),
                                    ml: 1,
                                }}
                            >
                                1 min 30s
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                        <IconButton
                            color={popover.open ? "inherit" : "default"}
                            onClick={popover.onOpen}
                        >
                            <Iconify icon="eva:more-horizontal-fill" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="bottom-center"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        // router.push(paths.dashboard.post.details(title));
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        // router.push(paths.dashboard.post.edit(title));
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        popover.onClose();
                    }}
                    sx={{ color: "error.main" }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>
        </>
    );
}
