import React, { useCallback, useReducer } from "react";

const UIInitialState = {
    refreshPage: false,
    numItemList: 0,
    bodyColor: null,
    headerColor: null,    
}

export const UIContext = React.createContext({
    ...UIInitialState,
    setRefreshPage: (status) => {},
    setNumItemList: (numItem) => {},
    setBodyColor: (color) => {},
    setHeaderColor: (color) => {},
});

const UIActionType = {
    SET_REFRESH_PAGE: 'SET_REFRESH_PAGE',
    SET_NUM_ITEM_LIST: 'SET_NUM_ITEM_LIST',
    SET_BODY_COLOR: 'SET_BODY_COLOR',
    SET_HEADER_COLOR: 'SET_HEADER_COLOR',
}

function uiReducer(state, action) {
    switch (action.type) {
        case UIActionType.SET_REFRESH_PAGE:
            return {
                ...state,
                refreshPage: action.value,
            }

        case UIActionType.SET_NUM_ITEM_LIST:
            return {
                ...state,
                numItemList: action.value,
            }

        case UIActionType.SET_BODY_COLOR:
            return {
                ...state,
                refreshPage: true,
                bodyColor: action.value,
            }

        case UIActionType.SET_HEADER_COLOR:
            return {
                ...state,
                // refreshPage: true,
                headerColor: action.value,
            }

        default:
            break;
    }
}

function UIContextProvider(props) {
    const [uiState, dispatchUI] = useReducer(uiReducer, UIInitialState);

    const setRefreshPage = useCallback((status) => {
        dispatchUI({
            type: UIActionType.SET_REFRESH_PAGE,
            value: status
        })
    }, []);

    const setNumItemList = useCallback(numItem => {
        dispatchUI({
            type: UIActionType.SET_NUM_ITEM_LIST,
            value: numItem,
        });
    }, [])

    const setBodyColor = useCallback((color) => {
        dispatchUI({
            type: UIActionType.SET_BODY_COLOR,
            value: color,
        })
    }, [])

    const setHeaderColor = useCallback((color) => {
        dispatchUI({
            type: UIActionType.SET_HEADER_COLOR,
            value: color,
        })
    }, []);

    const uiContext = {
        ...uiState,
        setRefreshPage,
        setNumItemList,
        setBodyColor,
        setHeaderColor,
    }

    return (
        <UIContext.Provider value={uiContext}>
            {props.children}
        </UIContext.Provider>
    )
}

export default UIContextProvider;