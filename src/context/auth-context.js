import React, { useCallback, useReducer } from 'react';

const authInitialState = {
    token: sessionStorage.getItem('token') ?? null,
    user: null,
}

export const AuthContext = React.createContext({
    ...authInitialState,
    setAuth: (token) => { },
    setUser: () => { },
    clearAuth: () => { },
});

const authActionTypes = {
    SET_AUTH: 'SET_AUTH',
    CLEAR_AUTH: 'CLEAR_AUTH',
    SET_USER: 'SET_USER',
}

function authReducer(state, action) {
    switch (action.type) {
        case authActionTypes.SET_AUTH:
            sessionStorage.setItem('token', action.value);
            return {
                ...state,
                token: action.value,
            }

        case authActionTypes.CLEAR_AUTH:
            sessionStorage.removeItem('token');
            return {
                ...authInitialState,
            };

        case authActionTypes.SET_USER:
            return {
                ...state,
                user: action.value,
            }

        default:
            return authInitialState;
    }
}

function AuthContextProvider(props) {
    const [authState, dispatchAuth] = useReducer(authReducer, authInitialState);

    const setAuth = useCallback((token) => {
        dispatchAuth({
            type: authActionTypes.SET_AUTH,
            value: token
        });
    }, []);

    const clearAuth = useCallback(() => {
        dispatchAuth({
            type: authActionTypes.CLEAR_AUTH,
        });
    }, []);

    const setUser = useCallback((user) => {
        dispatchAuth({
            type: authActionTypes.SET_USER,
            value: user,
        });
    }, []);

    const authContext = {
        ...authState,
        setAuth,
        clearAuth,
        setUser,
    }

    return (
        <AuthContext.Provider value={authContext}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;