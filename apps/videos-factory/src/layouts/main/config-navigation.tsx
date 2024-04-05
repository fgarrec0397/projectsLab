import Iconify from "@/components/iconify";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export const navConfig = [
    {
        title: "Home",
        icon: <Iconify icon="solar:home-2-bold-duotone" />,
        path: "/",
    },
    {
        title: "Pricing",
        path: paths.pricing,
        icon: <Iconify icon="solar:file-bold-duotone" />,
    },
    {
        title: "About us",
        icon: <Iconify icon="solar:home-2-bold-duotone" />,
        path: paths.about,
    },
    {
        title: "FAQ",
        icon: <Iconify icon="solar:home-2-bold-duotone" />,
        path: paths.faqs,
    },
];
