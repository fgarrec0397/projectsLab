export interface RenderingStrategy<T> {
    render(template: T): Promise<void>;
}
