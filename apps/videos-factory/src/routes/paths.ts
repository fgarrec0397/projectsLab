// ----------------------------------------------------------------------

const ROOTS = {
    AUTH: "/auth",
    DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
    home: "/",
    minimalUI: "https://mui.com/store/items/minimal-dashboard/",
    notFound: "/page-not-found",
    about: "/about-us",
    faqs: "/faq",
    pricing: "/pricing",
    termsAndConditions: "/terms-and-conditions",
    refundPolicy: "/refund-policy",
    privacyPolicy: "/privacy-policy",
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
            root: `${ROOTS.DASHBOARD}`,
            create: `${ROOTS.DASHBOARD}/videos/create`,
            byId: (id: string) => `${ROOTS.DASHBOARD}/videos/${id}`,
        },
        fileManager: `${ROOTS.DASHBOARD}/file-manager`,
        subscription: `${ROOTS.DASHBOARD}/subscription`,
        user: {
            myAccount: `${ROOTS.DASHBOARD}/my-account`,
        },
    },
};
