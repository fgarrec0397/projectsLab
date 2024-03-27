// ----------------------------------------------------------------------

const ROOTS = {
    AUTH: "/auth",
    DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
    minimalUI: "https://mui.com/store/items/minimal-dashboard/",
    notFound: "/page-not-found",
    // AUTH
    auth: {
        login: `${ROOTS.AUTH}/login`,
        verify: `${ROOTS.AUTH}/verify`,
        register: `${ROOTS.AUTH}/register`,
        forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    },
    // DASHBOARD
    dashboard: {
        root: ROOTS.DASHBOARD,
        channels: {
            root: `${ROOTS.DASHBOARD}/channels`,
            create: `${ROOTS.DASHBOARD}/channels/create`,
        },
        videos: {
            root: `${ROOTS.DASHBOARD}/videos`,
            create: `${ROOTS.DASHBOARD}/videos/create`,
            byId: (id: string) => `${ROOTS.DASHBOARD}/videos/${id}`,
        },
        fileManager: `${ROOTS.DASHBOARD}/file-manager`,
        billing: `${ROOTS.DASHBOARD}/billing`,
    },
};
