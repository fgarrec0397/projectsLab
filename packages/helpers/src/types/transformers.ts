/**
 * Take an interface as parameter and return all children types as union types;
 */
export type UnionOfProperties<Type> = {
    [Key in keyof Type]: Key extends any ? Type[Key] : never;
}[keyof Type];

/**
 * Recursively remove all nullable and/or undefined types from object
 */
export type DeepNonNullable<T> = {
    [K in keyof T]-?: DeepNonNullable<T[K]>;
};
/**
 * Recursively set all properties from object nullbable
 */
export type DeepNullable<T> = {
    [K in keyof T]?: DeepNonNullable<T[K]>;
};

/**
 * Set a single key or a set of keys from type Type to optional
 */
export type PartialBy<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;
