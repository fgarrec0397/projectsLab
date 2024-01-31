import { useMemo } from "react";

import { paths } from "@/routes/paths";
import { icon } from "@/theme/icons";

// ----------------------------------------------------------------------

const ICONS = {
    home: icon("home-2"),
    job: icon("suitcase"),
    mail: icon("letter"),
    user: icon("user"),
    file: icon("file"),
    lock: icon("lock"),
    folder: icon("folder"),
    invoice: icon("bill-list"),
    calendar: icon("calendar"),
    external: icon("square-arrow-right-up"),
};

// ----------------------------------------------------------------------

export function useNavData() {
    const data = useMemo(
        () => [
            // OVERVIEW
            // ----------------------------------------------------------------------
            {
                subheader: "overview v5.7.0",
                items: [
                    { title: "one", path: paths.dashboard.root, icon: ICONS.home },
                    { title: "two", path: paths.dashboard.two, icon: ICONS.job },
                    {
                        title: "three",
                        path: paths.dashboard.three,
                        icon: ICONS.mail,
                    },
                ],
            },

            // MANAGEMENT
            // ----------------------------------------------------------------------
            {
                subheader: "management",
                items: [
                    {
                        title: "user",
                        path: paths.dashboard.group.root,
                        icon: ICONS.user,
                        children: [
                            { title: "four", path: paths.dashboard.group.root },
                            { title: "five", path: paths.dashboard.group.five },
                            { title: "six", path: paths.dashboard.group.six },
                        ],
                    },
                ],
            },
        ],
        []
    );

    return data;
}
