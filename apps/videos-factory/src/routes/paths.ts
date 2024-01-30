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
        one: `${ROOTS.DASHBOARD}/one`,
        two: `${ROOTS.DASHBOARD}/two`,
        three: `${ROOTS.DASHBOARD}/three`,
        group: {
            root: `${ROOTS.DASHBOARD}/group`,
            five: `${ROOTS.DASHBOARD}/group/five`,
            six: `${ROOTS.DASHBOARD}/group/six`,
        },
    },
};
