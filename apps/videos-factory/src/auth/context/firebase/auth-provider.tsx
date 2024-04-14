"use client";

import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { useCallback, useEffect, useMemo, useReducer } from "react";

import { createUser, getCurrentUser } from "@/services/usersService/usersService";
import { IUser } from "@/types/user";

import { ActionMapType, AuthStateType, AuthUserType } from "../../types";
import { AuthContext } from "./auth-context";
import { firebaseApp } from "./lib";

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

export const AUTH = getAuth(firebaseApp);

enum Types {
    INITIAL = "INITIAL",
}

type Payload = {
    [Types.INITIAL]: {
        user: AuthUserType;
    };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
    user: null,
    loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
    if (action.type === Types.INITIAL) {
        return {
            loading: false,
            user: action.payload.user,
        };
    }
    return state;
};

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(() => {
        try {
            onAuthStateChanged(AUTH, async (user) => {
                if (user) {
                    if (user.emailVerified) {
                        const userData = await getCurrentUser((user as any).accessToken);

                        dispatch({
                            type: Types.INITIAL,
                            payload: {
                                user: {
                                    ...user,
                                    ...userData,
                                },
                            },
                        });
                    } else {
                        dispatch({
                            type: Types.INITIAL,
                            payload: {
                                user: null,
                            },
                        });
                    }
                } else {
                    dispatch({
                        type: Types.INITIAL,
                        payload: {
                            user: null,
                        },
                    });
                }
            });
        } catch (error) {
            dispatch({
                type: Types.INITIAL,
                payload: {
                    user: null,
                },
            });
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleRegister = async (token: string, user: Partial<IUser>) => {
        await createUser(token, user);
    };

    const login = useCallback(async (email: string, password: string) => {
        await signInWithEmailAndPassword(AUTH, email, password);
    }, []);

    const loginWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();

        const credentials = await signInWithPopup(AUTH, provider);
        const now = Date.now();
        const userCreatedAt = Number((credentials.user.metadata as any).createdAt) as number;
        const oneMinute = 1 * 60 * 1000;
        const targetTimestamp = userCreatedAt + oneMinute;

        if (now <= targetTimestamp) {
            const token = await credentials.user.getIdToken();
            const { user } = credentials;

            await handleRegister(token, {
                id: user.uid,
                email: user.email || undefined,
            });
        }
    }, []);

    // REGISTER
    const register = useCallback(async (email: string, password: string) => {
        const newUser = await createUserWithEmailAndPassword(AUTH, email, password);
        const { user } = newUser;
        /*
         * (1) If skip emailVerified
         * Remove : await sendEmailVerification(newUser.user);
         */
        await sendEmailVerification(user);

        await handleRegister((user as any).accessToken, {
            id: user.uid,
            email: user.email || undefined,
        });
    }, []);

    // LOGOUT
    const logout = useCallback(async () => {
        await signOut(AUTH);
    }, []);

    // FORGOT PASSWORD
    const forgotPassword = useCallback(async (email: string) => {
        await sendPasswordResetEmail(AUTH, email);
    }, []);

    // ----------------------------------------------------------------------

    /*
     * (1) If skip emailVerified
     * const checkAuthenticated = state.user?.emailVerified ? 'authenticated' : 'unauthenticated';
     */
    const checkAuthenticated = state.user?.emailVerified ? "authenticated" : "unauthenticated";

    const status = state.loading ? "loading" : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
            user: state.user,
            method: "firebase",
            loading: status === "loading",
            authenticated: status === "authenticated",
            unauthenticated: status === "unauthenticated",
            //
            login,
            logout,
            register,
            forgotPassword,
            loginWithGoogle,
        }),
        [
            status,
            state.user,
            //
            login,
            logout,
            register,
            forgotPassword,
            loginWithGoogle,
        ]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
