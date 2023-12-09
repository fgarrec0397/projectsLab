type CompositionConfig = {
    track: number;
    elements: any[]; // TODO - Build the other elements type before handling this
};

export class Composition {
    constructor(config: CompositionConfig) {
        console.log(config, "Composition constructor");
    }
}
