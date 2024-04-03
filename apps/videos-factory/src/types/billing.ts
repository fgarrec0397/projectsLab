export type IPlan = {
    id: string;
    name: string;
    description: string;
    subDescription: string;
    monthlyPrice: string;
    monthlyPriceId: string;
    yearlyPrice: string;
    yearlyPriceId: string;
    features: string[];
    moreFeatures: string[];
    sort: number;
};
