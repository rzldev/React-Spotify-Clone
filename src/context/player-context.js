import React, { useCallback, useReducer } from 'react';

const playerInitialState = {
    currentlyPlaying: null,
    deviceId: localStorage.getItem('deviceId') ? localStorage.getItem('deviceId') : null,
    devices: [],
    playingMs: 0,
}

export const PlayerContext = React.createContext({
    ...playerInitialState,
    setCurrentlyPlaying: () => {},
    setDevice: () => {},
    clearDevice: () => {},
    setDevices: () => {},
});

const playerActionType = {
    SET_CURRENTLY_PLAYING: 'SET_CURRENTLY_PLAYING',
    SET_DEVICE: 'SET_DEVICE',
    CLEAR_DEVICE: 'CLEAR_DEVICE',
    SET_DEVICES: 'SET_DEVICES',
}

function validateAndAddItem(oldArray, newArray) {
    const temp = oldArray;
    newArray.map(newItem => (!temp.reduce((output, item) => output || (item.id === newItem.id), false)) && temp.push(newItem));
    return temp;
}

function playerReducer(state, action) {
    switch (action.type) {
        case playerActionType.SET_CURRENTLY_PLAYING:
            const currentlyPlayingTemp = action.value;
            return {...state, currentlyPlaying: currentlyPlayingTemp}

        case playerActionType.SET_DEVICE:
            localStorage.setItem('deviceId', action.value);
            return {...state, deviceId: action.value}

        case playerActionType.CLEAR_DEVICE:
            localStorage.removeItem('deviceId');
            return {...state, deviceId: null}

        case playerActionType.SET_DEVICES:
            const devicesTemp = validateAndAddItem(state.devices, action.value);
            return { ...state, devices: devicesTemp };

        default:
            return {...state}
    }
}

function PlayerContextProvider(props) {
    const [playerState, dispatchPlayer] = useReducer(playerReducer, playerInitialState);

    const setCurrentlyPlaying = useCallback(item => {
        dispatchPlayer({
            type: playerActionType.SET_CURRENTLY_PLAYING,
            value: item,
        })
    }, []);

    const setDevice = useCallback(itemId => {
        dispatchPlayer({
            type: playerActionType.SET_DEVICE,
            value: itemId,
        })
    }, []);

    const clearDevice = useCallback(() => {
        dispatchPlayer({
            type: playerActionType.CLEAR_DEVICE,
        })
    }, []);

    const setDevices = useCallback((list) => {
        dispatchPlayer({
            type: playerActionType.SET_DEVICES,
            value: list,
        })
    }, []);

    const playerContext = {
        ...playerState,
        setCurrentlyPlaying,
        setDevice,
        clearDevice,
        setDevices,
    }

    return (
        <PlayerContext.Provider value={playerContext}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;