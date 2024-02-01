// ----------------------------------------------------------------------

const ROOTS = {
    AUTH: "/auth",
    DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
    minimalUI: "https://mui.com/store/items/minimal-dashboard/",
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
        },
        fileManager: `${ROOTS.DASHBOARD}/file-manager`,
        group: {
            root: `${ROOTS.DASHBOARD}/group`,
            five: `${ROOTS.DASHBOARD}/group/five`,
            six: `${ROOTS.DASHBOARD}/group/six`,
        },
    },
};
