export type IPlanVariant = {
    id: string;
    name: string;
    description: string;
    price: string;
    sort: number;
};

export type IPlan = {
    id: number;
    name: string;
    variants: IPlanVariant[];
};
