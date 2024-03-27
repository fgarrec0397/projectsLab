"use client";

import { useGetPricingPlans } from "@/services/billingService/hooks/useGetPricingPlans";

export default function BillingPage() {
    const { plans } = useGetPricingPlans();

    console.log(plans, "plans");

    return (
        <div>
            <h1>Billing</h1>
        </div>
    );
}
