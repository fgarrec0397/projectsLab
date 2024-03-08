import { useMemo } from "react";

import Label, { LabelColor } from "@/components/label";
import { VideoStatus } from "@/types/video";

type Props = {
    status: VideoStatus;
};

export default function VideosStatus({ status }: Props) {
    const statusColorMapping: Record<VideoStatus, LabelColor> = useMemo(
        () => ({
            draft: "default",
            generatingScript: "warning",
            scriptGenerated: "warning",
            generatingTemplate: "warning",
            templateGenerated: "warning",
            rendering: "warning",
            rendered: "success",
            publishing: "warning",
            published: "primary",
        }),
        []
    );

    const color = useMemo<LabelColor>(
        () => statusColorMapping[status],
        [status, statusColorMapping]
    );

    return (
        <Label variant="soft" color={color}>
            {status}
        </Label>
    );
}
