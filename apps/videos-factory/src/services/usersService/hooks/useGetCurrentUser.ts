"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IUser } from "@/types/user";

import { getCurrentUser } from "../usersService";
import { useOnUserUpdate } from "./useOnUserUpdate";

export const useGetCurrentUser = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR(
        ["currentUser", auth.user?.id],
        () => getCurrentUser(auth.user?.accessToken),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    useOnUserUpdate((value) => {
        mutate(
            async () => {
                const promise = new Promise<IUser>((resolve) => {
                    resolve(value);
                });

                return promise;
            },
            { revalidate: false }
        );
    });

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
