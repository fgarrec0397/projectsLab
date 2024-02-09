// import { useRouter } from "next/router";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { getFiles, getFilesFetcher } from "@/services/filesService/filesService";
import { fetcher } from "@/utils/axios";

export const useGetFiles = async () => {
    const auth = useAuthContext();
    // const router = useRouter();

    // const pathParam = router.query.path as string;
    const pathParam = "";
    console.log({ auth, pathParam });

    const swrKey =
        auth.user?.accessToken && auth.user?.id && pathParam
            ? [auth.user.accessToken as string, auth.user.id as string, pathParam]
            : null;

    const response = await getFiles(auth.user?.accessToken, auth.user?.id);
    const { data, isLoading, error, isValidating } = useSWR(swrKey, getFilesFetcher);

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
};
