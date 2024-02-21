export interface VoiceGeneratorStrategy {
    audio: Buffer | undefined;
    generateVoice(input: string, voiceFilePath: string): Promise<Buffer>;
}
