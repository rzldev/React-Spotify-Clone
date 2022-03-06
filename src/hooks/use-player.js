import { useCallback, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { AuthContext } from "../context/auth-context";
import { PlaybackContext } from "../context/playback-context";
import { PlayerContext } from "../context/player-context";

const spotifyApi = new SpotifyWebApi();

export const REPEAT_STATES = {
    CONTEXT: 'context',
    TRACK: 'track',
    OFF: 'off',
}

const usePlayer = () => {
    const { clearAuth } = useContext(AuthContext);
    const { deviceId, currentlyPlaying, setDevice, clearDevice, setCurrentlyPlaying, setDevices } = useContext(PlayerContext);
    const { setPlaybackState, setPlayingState, setShuffleState, setRepeatState } = useContext(PlaybackContext);

    // Set Token
    const setAccessToken = (token) => {
        spotifyApi.setAccessToken(token);
    }

    // Get Token
    const getAccessToken = () => {
        return spotifyApi.getAccessToken();
    }

    // Check Device
    const checkDevice = useCallback(async () => {
        try {
            if (deviceId) {
                await spotifyApi.transferMyPlayback([deviceId]);
            }
            else {
                const responseDevice = await spotifyApi.getMyDevices();
                const devices = await responseDevice.devices;

                devices.map((device) => device.name.includes('Web') && setDevice(device.id))

                await spotifyApi.transferMyPlayback([devices[0].id]);
            }
        } catch (e) {
            e.status === 401 && clearAuth();
            e.status === 404 && clearDevice();
        }
    }, [deviceId, setDevice, clearDevice, clearAuth]);

    // Get devices
    const getDevices = useCallback(async () => {
        try {
            const responseDevice = await spotifyApi.getMyDevices();
            const devices = await responseDevice.devices;

            setDevices(devices);
        } catch (e) {
            e.status === 401 && clearAuth();
        }
    }, [setDevices, clearAuth]);

    // Fetch Playback
    const fetchPlaybackState = useCallback(async () => {
        try {
            const playbackResponse = await spotifyApi.getMyCurrentPlaybackState();
            setPlaybackState(playbackResponse);

            if (playbackResponse.status >= 400) throw new Error(playbackResponse);

            const currentlyPlayingResponse = await spotifyApi.getMyCurrentPlayingTrack();
            if (!currentlyPlaying
                || currentlyPlaying.is_playing !== currentlyPlayingResponse.is_playing
                || currentlyPlaying.item.id !== currentlyPlayingResponse.item.id)
                setCurrentlyPlaying(currentlyPlayingResponse);
        } catch (e) {
            e.status === 401 && clearAuth()

        }
    }, [currentlyPlaying, setPlaybackState, setCurrentlyPlaying, clearAuth]);

    // Play Songs
    const playSongs = useCallback((uris = [], position = null) => {
        setPlayingState(true);

        let body = {}
        if (uris.length > 0) body = { ...body, uris: uris };
        if (position) body = { ...body, offset: { position: position } }

        spotifyApi.play(body)
            .catch(e => {
                console.log(e);
                setPlayingState(false);
                e.status === 401 && clearAuth()
            });
    }, [setPlayingState, clearAuth])

    // Play Non-song (Album, Playlist, ...)
    const play = useCallback((uri = null, position = null) => {
        setPlayingState(true);

        let body = {};
        if (uri != null) body = { ...body, context_uri: uri };
        if (position != null) body = { ...body, offset: { position: position } };

        spotifyApi.play(body)
            .catch(e => {
                setPlayingState(false);
                e.status === 401 && clearAuth()
            });
    }, [setPlayingState, clearAuth])

    // Pause
    const pause = useCallback(() => {
        setPlayingState(false);
        spotifyApi.pause()
            .catch(e => {
                setPlayingState(true);
                e.status === 401 && clearAuth()
            });
    }, [setPlayingState, clearAuth])

    // Seek
    const seek = useCallback((playingProgressMs) => {
        spotifyApi.seek(playingProgressMs).catch(e => e.status === 401 && clearAuth());
    }, [clearAuth]);

    // Next
    const next = () => {
        spotifyApi.skipToNext()
            .then(() => fetchPlaybackState())
            .catch(e => e.status === 401 && clearAuth());
    }

    // Prev
    const prev = () => {
        spotifyApi.skipToPrevious()
            .then(() => fetchPlaybackState())
            .catch(e => e.status === 401 && clearAuth());
    }

    // Shuffle
    const shuffle = (shuffleState) => {
        // const shuffleState = playbackState.shuffle_state;
        setShuffleState(!shuffleState);

        spotifyApi.setShuffle(!shuffleState)
            .catch(e => {
                e.status === 401 && clearAuth()
                setShuffleState(shuffle)
            });
    }

    // Repeat
    const repeat = (repeatState) => {
        // const repeatState = playbackState.repeat_state;
        let stateNow = null;
        switch (repeatState) {
            case REPEAT_STATES.CONTEXT:
                stateNow = REPEAT_STATES.TRACK;
                break;

            case REPEAT_STATES.TRACK:
                stateNow = REPEAT_STATES.OFF;
                break;

            case REPEAT_STATES.OFF:
                stateNow = REPEAT_STATES.CONTEXT;
                break;

            default:
                stateNow = REPEAT_STATES.CONTEXT;
                break;
        }

        setRepeatState(stateNow);

        spotifyApi.setRepeat(stateNow)
            // .then(() => setRepeatState(stateNow))
            .catch(e => {
                e.status === 401 && clearAuth();
                setRepeatState(repeatState)
            });
    }

    // Add to Queue
    const addToQueue = useCallback((uri) => {
        spotifyApi.queue(uri)
            .then(res => console.log(res))
            .catch(e => console.log(e));
    }, [])

    // Set Volume
    const setVolume = useCallback(async (percentageVolume) => {
        try {
            // console.log(percentageVolume);
            const volumeResponse = await spotifyApi.setVolume(percentageVolume);

            if (volumeResponse !== null) return true;
            else throw new Error({ message: 'Error', status: 500 });
        } catch (e) {
            e.status === 401 && clearAuth();

            return false;
        }
    }, [clearAuth])

    // Mute
    const mute = async () => {
        try {
            const response = await spotifyApi.setVolume(0)
            console.log(response);

            return true;
        } catch (e) {
            e.status === 401 && clearAuth()
            return false;
        }
    }

    // Un-mute
    const unMute = async (volume) => {
        try {
            const response = await spotifyApi.setVolume(volume)
            console.log(response);

            return true;
        } catch (e) {
            e.status === 401 && clearAuth()
            return false;
        }
    }

    return {
        setAccessToken,
        getAccessToken,
        fetchPlaybackState,
        checkDevice,
        getDevices,
        playSongs,
        play,
        pause,
        seek,
        next,
        prev,
        shuffle,
        repeat,
        addToQueue,
        setVolume,
        mute,
        unMute,
    }
}

export default usePlayer;