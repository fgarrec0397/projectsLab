const getEnv = () => process.env;

export const getOpenAiApiKey = () => {
    const apiKey = getEnv().OPENAI_API_KEY;

    if (!apiKey) {
        throw Error("Your OpenAI API keep is not set");
    }

    return apiKey;
};
