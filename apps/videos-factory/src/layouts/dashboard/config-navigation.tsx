import { useMemo } from "react";

import { paths } from "@/routes/paths";
import { icon } from "@/theme/icons";

// ----------------------------------------------------------------------

const ICONS = {
    home: icon("home-2"),
    job: icon("suitcase"),
    subscription: icon("dollar"),
    mail: icon("letter"),
    user: icon("user"),
    file: icon("file"),
    lock: icon("lock"),
    folder: icon("folder"),
    invoice: icon("bill-list"),
    calendar: icon("calendar"),
    external: icon("square-arrow-right-up"),
    videos: icon("video-library"),
};

// ----------------------------------------------------------------------

export function useNavData() {
    const data = useMemo(
        () => [
            {
                items: [
                    {
                        title: "videos",
                        path: paths.dashboard.videos.root,
                        icon: ICONS.videos,
                    },
                    {
                        title: "files manager",
                        path: paths.dashboard.fileManager,
                        icon: ICONS.file,
                    },
                    {
                        title: "subscription",
                        path: paths.dashboard.subscription,
                        icon: ICONS.subscription,
                    },
                ],
            },
        ],
        []
    );

    return data;
}
