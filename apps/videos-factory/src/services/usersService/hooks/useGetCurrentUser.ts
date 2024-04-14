"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";

import { getCurrentUser } from "../usersService";

export const useGetCurrentUser = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR(
        "currentUser",
        () => getCurrentUser(auth.user?.accessToken),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const memoizedResponse = useMemo(
        () => ({
            currentUser: data,
            isCurrentUserLoading: isLoading,
            currentUserError: error,
            isCurrentUserValidating: isValidating,
            mutateCurrentUser: mutate,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
