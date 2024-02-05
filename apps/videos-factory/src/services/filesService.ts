import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { endpoints } from "@/routes/endpoints";
import { fetcher } from "@/utils/axios";

export const getFiles = async (idToken: string) => {
    const response = await axios.get(endpoints.files.get, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${idToken}`,
        },
    });

    console.log(response, "response");
};

export async function useGetFiles() {
    const auth = useAuthContext();
    console.log({ auth });

    // const idToken = await auth.user?.getIdToken();
    const URL = `${endpoints.files.get}`;

    const data = await getFiles(auth.user?.accessToken);
    // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    console.log(data, "data");

    // const memoizedValue = useMemo(
    //     () => ({
    //         products: (data?.products as IProductItem[]) || [],
    //         productsLoading: isLoading,
    //         productsError: error,
    //         productsValidating: isValidating,
    //         productsEmpty: !isLoading && !data?.products.length,
    //     }),
    //     [data?.products, error, isLoading, isValidating]
    // );

    // return memoizedValue;
}
