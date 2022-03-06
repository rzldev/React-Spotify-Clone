import React, { useCallback, useReducer } from "react";

const playbackInitialState = {
    playbackState: null,
};

export const PlaybackContext = React.createContext({
    ...playbackInitialState,
    setPlaybackState: () => {},
    setPlayingState: () => {},
    setShuffleState: () => {},
    setRepeatState: () => {},
});

const PlaybackActionType = {
    SET_PLAYBACK_STATE: 'SET_PLAYBACK_STATE',
    SET_PLAYING_STATE: 'SET_PLAYING_STATE',
    SET_SHUFFLE_STATE: 'SET_SHUFFLE_STATE',
    SET_REPEAT_STATE: 'SET_REPEAT_STATE',
}

function playbackReducer(state, action) {
    switch (action.type) {
        case PlaybackActionType.SET_PLAYBACK_STATE:
            const playbackStateTemp = action.value;
            return {...state, playbackState: playbackStateTemp}

        case PlaybackActionType.SET_SHUFFLE_STATE:
            const playbackShuffleState = state.playbackState ? {...state.playbackState, shuffle_state: action.value} : null;
            return {...state, playbackState: playbackShuffleState}

        case PlaybackActionType.SET_PLAYING_STATE:
            const playbackPlayingState = state.playbackState ? {...state.playbackState, is_playing: action.value} : null;
            return {...state, playbackState: playbackPlayingState}

        case PlaybackActionType.SET_REPEAT_STATE:
            const playbackRepeatState = state.playbackState ? {...state.playbackState, repeat_state: action.value} : null;
            return {...state, playbackState: playbackRepeatState}

        default:
            return state;
    }
}

function PlaybackContextProvider(props) {
    const [playbackState, dispatchPlayback] = useReducer(playbackReducer, playbackInitialState);


    const setPlaybackState = useCallback(item => {
        dispatchPlayback({
            type: PlaybackActionType.SET_PLAYBACK_STATE,
            value: item,
        });
    }, []);

    const setPlayingState = useCallback((playingState) => {
        dispatchPlayback({
            type: PlaybackActionType.SET_PLAYING_STATE,
            value: playingState,
        })
    }, []);

    const setShuffleState = (status) => {
        dispatchPlayback({
            type: PlaybackActionType.SET_SHUFFLE_STATE,
            value: status,
        });
    }

    const setRepeatState = (status) => {
        dispatchPlayback({
            type: PlaybackActionType.SET_REPEAT_STATE,
            value: status
        });
    }


    const context = {
        ...playbackState,
        setPlaybackState,
        setPlayingState,
        setShuffleState,
        setRepeatState,
    }

    return (
        <PlaybackContext.Provider value={context}>
            {props.children}
        </PlaybackContext.Provider>
    );
}

export default PlaybackContextProvider;