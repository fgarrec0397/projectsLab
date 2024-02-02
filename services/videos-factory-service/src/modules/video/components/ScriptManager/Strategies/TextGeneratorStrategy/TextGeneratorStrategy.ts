export interface TextGeneratorStrategy {
    generateText(): Promise<string>;
}
