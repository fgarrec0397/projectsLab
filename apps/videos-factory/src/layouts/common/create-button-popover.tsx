import { MenuItem } from "@mui/material";
import { FC } from "react";

import { PrimaryButton } from "@/components/button";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";

const OPTIONS = [
    {
        label: "A channel",
        linkTo: paths.dashboard.channels.create,
    },
    {
        label: "A video",
        linkTo: paths.dashboard.videos.create,
    },
];

const CreateButtonPopover: FC = () => {
    const router = useRouter();

    const popover = usePopover();

    const handleClickItem = (path: string) => {
        popover.onClose();
        router.push(path);
    };

    return (
        <>
            <PrimaryButton variant="contained" color="primary" onClick={popover.onOpen}>
                Create
            </PrimaryButton>
            <CustomPopover open={popover.open} onClose={popover.onClose}>
                {OPTIONS.map((x, index) => (
                    <MenuItem
                        key={x.linkTo}
                        onClick={() => handleClickItem(x.linkTo)}
                        divider={index !== OPTIONS.length - 1}
                    >
                        {x.label}
                    </MenuItem>
                ))}
            </CustomPopover>
        </>
    );
};

export default CreateButtonPopover;
