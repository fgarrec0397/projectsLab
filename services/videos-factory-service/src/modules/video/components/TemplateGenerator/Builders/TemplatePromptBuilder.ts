type PromptMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

export class TemplatePromptBuilder {
    userMessages: PromptMessage[] = [];

    systemMessages: PromptMessage[] = [];

    addUserPrompt(content: string) {
        const message: PromptMessage = {
            role: "user",
            content,
        };

        this.userMessages.push(message);

        return this;
    }

    addSystemPrompt(content: string) {
        const message: PromptMessage = {
            role: "system",
            content,
        };

        this.systemMessages.push(message);

        return this;
    }

    build() {
        return [...this.systemMessages, ...this.userMessages];
    }
}
