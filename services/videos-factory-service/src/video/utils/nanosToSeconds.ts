export const nanosToSeconds = (nanos?: number) => {
    if (nanos === undefined) {
        return 0;
    }

    return nanos / 1e9;
};
