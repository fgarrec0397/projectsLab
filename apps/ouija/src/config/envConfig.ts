const getEnv = () => process.env;

export const getOpenAiApiKey = () => {
    const apiKey = getEnv().OPENAI_API_KEY;

    return apiKey;
};
