export type Plan = {
    id: string;
    name: string;
    description: string;
    monthlyPrice: string;
    monthlyPriceId: string;
    yearlyPrice: string;
    yearlyPriceId: string;
    features: string[];
    moreFeatures: string[];
    sort: number;
};
