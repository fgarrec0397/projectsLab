export const nanosToSeconds = (nanos?: number) => {
    if (!nanos) {
        return 0;
    }

    return nanos / 1e9;
};
