type AudioConfig = {
    name: string;
    sourcePath: string;
};

export class Audio {
    constructor(config: AudioConfig) {
        console.log(config, "Audio constructor");
    }
}
