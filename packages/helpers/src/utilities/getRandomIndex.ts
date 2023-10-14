export const getRandomIndex = <TArrayValue>(array: TArrayValue[]) => {
    const randomIndex = Math.floor(Math.random() * array.length);

    return randomIndex;
};
