"use client";

import {
    createUserWithEmailAndPassword,
    getAuth,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    TwitterAuthProvider,
} from "firebase/auth";
import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useReducer } from "react";

import { sessionLogin, sessionLogout } from "@/services/auth/authService";

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

const DB = getFirestore(firebaseApp);

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
                        const userProfile = doc(DB, "users", user.uid);

                        const docSnap = await getDoc(userProfile);

                        const profile = docSnap.data();

                        dispatch({
                            type: Types.INITIAL,
                            payload: {
                                user: {
                                    ...user,
                                    ...profile,
                                    id: user.uid,
                                    role: "admin",
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
            console.error(error);
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

    // LOGIN
    const login = useCallback(async (email: string, password: string) => {
        const credentials = await signInWithEmailAndPassword(AUTH, email, password);

        const idToken = await credentials.user.getIdToken();

        await sessionLogin(idToken);
    }, []);

    const loginWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();

        const credentials = await signInWithPopup(AUTH, provider);

        const idToken = await credentials.user.getIdToken();

        await sessionLogin(idToken);
    }, []);

    const loginWithGithub = useCallback(async () => {
        const provider = new GithubAuthProvider();

        const credentials = await signInWithPopup(AUTH, provider);

        const idToken = await credentials.user.getIdToken();

        await sessionLogin(idToken);
    }, []);

    const loginWithTwitter = useCallback(async () => {
        const provider = new TwitterAuthProvider();

        const credentials = await signInWithPopup(AUTH, provider);

        const idToken = await credentials.user.getIdToken();

        await sessionLogin(idToken);
    }, []);

    // REGISTER
    const register = useCallback(
        async (email: string, password: string, firstName: string, lastName: string) => {
            const newUser = await createUserWithEmailAndPassword(AUTH, email, password);

            /*
             * (1) If skip emailVerified
             * Remove : await sendEmailVerification(newUser.user);
             */
            await sendEmailVerification(newUser.user);

            const userProfile = doc(collection(DB, "users"), newUser.user?.uid);

            await setDoc(userProfile, {
                uid: newUser.user?.uid,
                email,
                displayName: `${firstName} ${lastName}`,
            });
        },
        []
    );

    // LOGOUT
    const logout = useCallback(async () => {
        await sessionLogout();

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
            loginWithGithub,
            loginWithTwitter,
        }),
        [
            status,
            state.user,
            //
            login,
            logout,
            register,
            forgotPassword,
            loginWithGithub,
            loginWithGoogle,
            loginWithTwitter,
        ]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
