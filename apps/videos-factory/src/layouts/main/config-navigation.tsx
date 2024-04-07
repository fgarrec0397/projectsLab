import { paths } from "@/routes/paths";
import { icon } from "@/theme/icons";

// ----------------------------------------------------------------------

export const navConfig = [
    {
        title: "Pricing",
        path: paths.pricing,
        icon: icon("dollar"),
    },
    {
        title: "FAQ",
        icon: icon("question-circle"),
        path: paths.faqs,
    },
];
