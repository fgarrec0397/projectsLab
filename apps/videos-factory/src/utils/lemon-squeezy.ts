import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

import { LEMONSQUEEZY_API } from "@/config-global";
/**
 * Ensures that required environment variables are set and sets up the Lemon
 * Squeezy JS SDK. Throws an error if any environment variables are missing or
 * if there's an error setting up the SDK.
 */
export function configureLemonSqueezy() {
    console.log("configureLemonSqueezy");

    lemonSqueezySetup({
        apiKey: LEMONSQUEEZY_API.apiKey,
        onError: (error) => {
            throw new Error(`Lemon Squeezy API error: ${error.message}`);
        },
    });
}
