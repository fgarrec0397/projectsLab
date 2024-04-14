"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";

import { getUserById } from "../usersService";

export const useGetUser = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR(
        "currentUser",
        () => getUserById(auth.user?.accessToken, auth.user?.uid),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const memoizedResponse = useMemo(
        () => ({
            user: data,
            isUserLoading: isLoading,
            userError: error,
            isUserValidating: isValidating,
            mutateUser: mutate,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
