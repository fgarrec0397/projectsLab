const baseURL = `${process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_URL}`;

export const endpoints = {
    auth: {
        login: `${baseURL}/auth/sessionLogin`,
        logout: `${baseURL}/auth/logout`,
    },
    files: {
        get: `${baseURL}/files`,
        post: `${baseURL}/files`,
        rename: `${baseURL}/files`,
        delete: `${baseURL}/files`,
        createFolder: `${baseURL}/files/createFolder`,
    },
    videos: {
        get: `${baseURL}/videos`,
        byId: (videoId?: string) => `${baseURL}/videos/${videoId}`,
        delete: `${baseURL}/videos`,
        startRendering: `${baseURL}/videos/startRendering`,
        videoUrl: {
            byId: (videoId?: string) => `${baseURL}/videos/videoUrl/${videoId}`,
        },
        draft: {
            getLast: `${baseURL}/videos/draft/getLast`,
            save: `${baseURL}/videos/draft/save`,
        },
    },
    subscriptions: {
        update: `${baseURL}/subscriptions/update`,
        cancel: `${baseURL}/subscriptions/cancel`,
    },
    plans: {
        get: `${baseURL}/plans`,
    },
    users: {
        current: `${baseURL}/users/current`,
        byId: (userId?: string) => `${baseURL}/users/${userId}`,
        create: `${baseURL}/users/create`,
    },
};
