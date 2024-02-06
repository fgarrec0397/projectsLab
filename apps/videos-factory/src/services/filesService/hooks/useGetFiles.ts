import { useAuthContext } from "@/auth/hooks";
import { getFiles } from "@/services/filesService/filesService";

export const useGetFiles = async () => {
    const auth = useAuthContext();
    console.log({ auth });

    // const idToken = await auth.user?.getIdToken();

    const data = await getFiles(auth.user?.accessToken, auth.user?.id);
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
};
