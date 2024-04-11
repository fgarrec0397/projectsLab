export const addMonth = (time: number) => {
    const date = new Date(time);

    date.setMonth(date.getMonth() + 1);

    return date.getTime();
};
