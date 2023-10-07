const getEnv = () => process.env;

export const getOpenAiApiKey = () => {
    const apiKey = getEnv().OPENAI_API_KEY;

    if (!apiKey) {
        throw Error("OPENAI_API_KEY is not set");
    }

    return apiKey;
};
