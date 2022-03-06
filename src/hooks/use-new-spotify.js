import { useCallback, useReducer } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const useSpotifyAPI = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const scopes = [
        'user-read-currently-playing',
        'user-read-recently-played',
        'user-read-playback-state',
        'user-top-read',
        'user-modify-playback-state',
        'user-library-read',
        'user-library-modify',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-follow-read',
        'user-follow-modify',
    ];
    const redirectUri = 'http://localhost:3000/'

    const accessUri = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes.join("%20")}&redirect_uri=${redirectUri}&show_dialog=true`;

    /* http://localhost:3000/#access_token=token&token_type=Bearer&expires_in=3600 */
    const getTokenFromResponse = () => {
        const hash = window.location.hash
            .substring(1)
            .split('&').reduce((init, item) => {
                let parts = item.split('=');
                init[parts[0]] = decodeURIComponent(parts[1]);
                return init
            }, {});

        return hash;
    }

    const setToken = useCallback(token => {
        spotifyApi.setAccessToken(token);
    }, []);

    const getToken = useCallback(() => {
        return spotifyApi.getAccessToken();
    }, []);

    return {
        accessUri,
        getTokenFromResponse,
        setToken,
        getToken,
    }
}

const spotifyDefaultState = {
    user: null,
    recentlyPlayed: [],
    newReleases: [],
    suggestedArtists: [],
    categories: [],
    recommendedTracks: [],
    topTracks: [],
    topArtists: [],
    userPlaylists: [],
    playlist: null,
    savedAlbums: [],
    album: null,
    albums: [],
    followedArtists: [],
    artist: null,
    artists: [],
    artistAlbums: [],
    artistTopTracks: [],
    savedTracks: [],
    track: null,
    error: null,
}

const spotifyActions = {
    SET_USER: 'SET_USER',
    SET_RECENTLY_PLAYED: 'SET_RECENTLY_PLAYED',
    SET_NEW_RELEASES: 'SET_NEW_RELEASES',
    SET_SUGGESTED_ARTISTS: 'SET_SUGGESTED_ARTISTS',
    SET_CATEGORIES: 'SET_CATEGORIES',
    SET_RECOMMENDED_TRACKS: 'SET_RECOMMENDED_TRACKS',
    SET_TOP_TRACKS: 'SET_TOP_TRACKS',
    SET_TOP_ARTISTS: 'SET_TOP_ARTISTS',
    SET_USER_PLAYLISTS: 'SET_USER_PLAYLISTS',
    SET_PLAYLIST: 'SET_PLAYLIST',
    SET_SAVED_ALBUMS: 'SET_SAVED_ALBUMS',
    SET_ALBUM: 'SET_ALBUM',
    SET_ALBUMS: 'SET_ALBUMS',
    SET_FOLLOWED_ARTISTS: 'SET_FOLLOWED_ARTISTS',
    SET_ARTIST: 'SET_ARTIST',
    SET_ARTIST_ALBUMS: 'SET_ARTIST_ALBUMS',
    SET_ARTIST_TOP_TRACKS: 'SET_ARTIST_TOP_TRACKS',
    SET_ARTISTS: 'SET_ARTISTS',
    SET_SAVED_TRACKS: 'SET_SAVED_TRACKS',
    SET_TRACK: 'SET_TRACK',
    SET_ERROR: 'SET_ERROR',
}

function SpotifyReducer(state, action) {
    switch (action.type) {
        case spotifyActions.SET_USER:
            return { ...state, user: action.value, error: null };

        case spotifyActions.SET_RECENTLY_PLAYED:
            return { ...state, recentlyPlayed: action.value, error: null }

        case spotifyActions.SET_NEW_RELEASES:
            return { ...state, newReleases: action.value, error: null }

        case spotifyActions.SET_SUGGESTED_ARTISTS:
            return { ...state, suggestedArtists: action.value, error: null }

        case spotifyActions.SET_CATEGORIES:
            return { ...state, categories: action.value, error: null }

        case spotifyActions.SET_RECOMMENDED_TRACKS:
            return { ...state, recommendedTracks: action.value, error: null }

        case spotifyActions.SET_TOP_TRACKS:
            return { ...state, topTracks: action.value, error: null }

        case spotifyActions.SET_TOP_ARTISTS:
            return { ...state, topArtists: action.value, error: null };

        case spotifyActions.SET_USER_PLAYLISTS:
            return { ...state, userPlaylists: action.value, error: null };

        case spotifyActions.SET_PLAYLIST:
            return { ...state, playlist: action.value, error: null };

        case spotifyActions.SET_SAVED_ALBUMS:
            return { ...state, savedAlbums: action.value, error: null };

        case spotifyActions.SET_ALBUM:
            return { ...state, album: action.value, error: null };

        case spotifyActions.SET_ALBUMS:
            return { ...state, albums: action.value, error: null };

        case spotifyActions.SET_FOLLOWED_ARTISTS:
            return { ...state, followedArtists: action.value, error: null };

        case spotifyActions.SET_ARTIST:
            return { ...state, artist: action.value, error: null };

        case spotifyActions.SET_ARTISTS:
            return { ...state, artists: action.value, error: null };

        case spotifyActions.SET_ARTIST_ALBUMS:
            return { ...state, artistAlbums: action.value, error: null }

        case spotifyActions.SET_ARTIST_TOP_TRACKS:
            return { ...state, artistTopTracks: action.value, error: null }

        case spotifyActions.SET_SAVED_TRACKS:
            return { ...state, savedTracks: action.value, error: null };

        case spotifyActions.SET_TRACK:
            return { ...state, track: action.value, error: null };

        case spotifyActions.SET_ERROR:
            return { ...spotifyDefaultState, error: action.value };

        default:
            return { ...spotifyDefaultState };
    }
}

export const useSpotify = () => {
    const [spotifyState, dispatchSpotify] = useReducer(SpotifyReducer, spotifyDefaultState);

    const dispatch = (type, value) => {
        dispatchSpotify({
            type: type,
            value: value
        });
    }

    const setError = (response) => {
        console.log(response);
        dispatchSpotify({
            type: spotifyActions.SET_ERROR,
            value: {
                status: response.status,
                body: JSON.parse(response.responseText).error,
            }
        });
    }

    const checkIfFailed = (response) => {
        return response && response.status && response.status >= 400;
    }

    const isSavedOrFollowed = (item) => {
        return item ? true : false;
    }

    const getUser = useCallback(() => {
        spotifyApi.getUser()
            .then(response => dispatch(spotifyActions.SET_USER, response))
            .catch(error => setError(error));
    }, []);

    const getUserById = useCallback((userId) => {
        spotifyApi.getUser(userId)
            .then(response => dispatch(spotifyActions.SET_USER, response))
            .catch(error => setError(error));
    }, [])

    const getRecentlyPlayed = useCallback(async () => {
        let recentlyPlayedTracks = [];
        let recentlyPlayedTemp = [];

        const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
        response.items.map(item => {
            if (item.context === null) return 0;

            const itemFound = recentlyPlayedTracks.find(track => track.context.uri === item.context.uri);
            return !itemFound && recentlyPlayedTracks.unshift(item);
        });

        await recentlyPlayedTracks.map(item => {
            const id = item.context.uri.split(':')[2];

            switch (item.context.type) {
                case 'playlist':
                    spotifyApi.getPlaylist(id)
                        .then(playlist => recentlyPlayedTemp.unshift(playlist))
                        .finally(() =>
                            (recentlyPlayedTemp.length === recentlyPlayedTracks.length)
                            && dispatch(spotifyActions.SET_RECENTLY_PLAYED, recentlyPlayedTemp)
                        )
                        .catch(e => setError(e));
                    break;

                case 'album':
                    spotifyApi.getAlbum(id)
                        .then(album => recentlyPlayedTemp.unshift(album))
                        .finally(() =>
                            (recentlyPlayedTemp.length === recentlyPlayedTracks.length)
                            && dispatch(spotifyActions.SET_RECENTLY_PLAYED, recentlyPlayedTemp)
                        )
                        .catch(e => setError(e));
                    break;

                case 'artist':
                    spotifyApi.getArtist(id)
                        .then(artist => recentlyPlayedTemp.unshift(artist))
                        .finally(() =>
                            (recentlyPlayedTemp.length === recentlyPlayedTracks.length)
                            && dispatch(spotifyActions.SET_RECENTLY_PLAYED, recentlyPlayedTemp)
                        )
                        .catch(e => setError(e));
                    break;

                default:
                    break;
            }
            return true;
        });
    }, []);

    const getNewReleases = useCallback(() => {
        spotifyApi.getNewReleases()
            .then(response => dispatch(spotifyActions.SET_NEW_RELEASES, response.albums.items))
            .catch(e => setError(e));
    }, []);

    const getSuggestedArtists = useCallback(() => {
        spotifyApi.getMyTopArtists()
            .then(response => dispatch(spotifyActions.SET_SUGGESTED_ARTISTS, response.items))
            .catch(e => setError(e));
    }, []);

    const getCategories = useCallback(() => {
        spotifyApi.getCategories({ limit: 50, country: navigator.language.split('-')[1].toUpperCase() })
            .then(response => dispatch(spotifyActions.SET_CATEGORIES, response.categories.items))
            .catch(e => setError(e));
    }, []);

    const getGenreSeeds = useCallback(() => {
        spotifyApi.getAvailableGenreSeeds()
            .then(response => console.log(response))
            .catch(e => setError(e));
    }, []);

    const getRecommendedTracks = useCallback((seedArtists = [], seedTracks = []) => {
        spotifyApi.getRecommendations({ seed_artists: seedArtists.join(','), seed_tracks: seedTracks.join(','), limit: 10 })
            .then(response => dispatch(spotifyActions.SET_RECOMMENDED_TRACKS, response.tracks))
            .catch(e => setError(e));
    }, []);

    const getTopTracks = useCallback(() => {
        spotifyApi.getMyTopTracks()
            .then(response => dispatch(spotifyActions.SET_TOP_TRACKS, response.items))
            .catch(e => setError(e));
    }, []);

    const getTopArtists = useCallback(() => {
        spotifyApi.getMyTopArtists()
            .then(response => dispatch(spotifyActions.SET_TOP_ARTISTS, response.items))
            .catch(e => setError(e));
    }, []);

    const getUserPlaylists = useCallback((userId = null) => {
        spotifyApi.getUserPlaylists((userId !== null) && userId)
            .then(response => dispatch(spotifyActions.SET_USER_PLAYLISTS, response.items))
            .catch(e => setError(e));
    }, []);

    const getPlaylistById = useCallback((playlistId) => {
        spotifyApi.getPlaylist(playlistId)
            .then(response => dispatch(spotifyActions.SET_PLAYLIST, response))
            .catch(e => setError(e));
    }, [])

    const addTrackToPlaylist = async (playlistId, uris) => {
        const response = await spotifyApi.addTracksToPlaylist(playlistId, uris);
        return !checkIfFailed(response);
    }

    const removeTrackFromPlaylist = async (playlistId, uris) => {
        const response = await spotifyApi.removeTracksFromPlaylist(playlistId, uris);
        return !checkIfFailed(response);
    }

    const followPlaylist = async (playlistId) => {
        const response = await spotifyApi.followPlaylist(playlistId);
        return response.length === 0 ? true : !checkIfFailed(response);
    }

    const unfollowPlaylist = async (playlistId) => {
        const response = await spotifyApi.unfollowPlaylist(playlistId);
        return response.length === 0 ? true : !checkIfFailed(response);
    }

    const isPlaylistSaved = (playlists, playlistId) => {
        const isFollowed = playlists.find(playlist => playlist.id === playlistId);
        return isSavedOrFollowed(isFollowed);
    }

    const getSavedAlbums = useCallback(() => {
        spotifyApi.getMySavedAlbums()
            .then(response => dispatch(spotifyActions.SET_SAVED_ALBUMS, response.items))
            .catch(e => setError(e));
    }, []);

    const getAlbumById = useCallback((albumId) => {
        spotifyApi.getAlbum(albumId)
            .then(response => dispatch(spotifyActions.SET_ALBUM, response))
            .catch(e => setError(e))
    }, []);

    const getAlbums = useCallback((albumIds) => {
        spotifyApi.getAlbums(albumIds)
            .then(response => dispatch(spotifyActions.SET_ALBUMS, response.albums))
            .catch(e => setError(e));
    }, []);

    const addAlbumToSavedAlbum = async (albumId) => {
        const response = await spotifyApi.addToMySavedAlbums([albumId]);
        return !checkIfFailed(response);
    }

    const removeAlbumFromSavedAlbum = async (albumId) => {
        const response = await spotifyApi.removeFromMySavedAlbums([albumId]);
        return !checkIfFailed(response);
    }

    const isAlbumSaved = (savedAlbums, albumId) => {
        const isSaved = savedAlbums.find(album => album.id === albumId);
        return isSavedOrFollowed(isSaved);
    }

    const getFollowedArtists = useCallback(() => {
        spotifyApi.getFollowedArtists()
            .then(response => dispatch(spotifyActions.SET_FOLLOWED_ARTISTS, response.artists.items))
            .catch(e => setError(e));
    }, [])

    const getArtistById = useCallback((artistId) => {
        spotifyApi.getArtist(artistId)
            .then(response => dispatch(spotifyActions.SET_ARTIST, response))
            .catch(e => setError(e));
    }, []);

    const getArtistAlbums = useCallback((artistId) => {
        spotifyApi.getArtistAlbums(artistId)
            .then(response => dispatch(spotifyActions.SET_ARTIST_ALBUMS, response.items))
            .catch(e => setError(e));
    }, []);

    const getArtistTopTracks = useCallback((artistId, countryId) => {
        spotifyApi.getArtistTopTracks(artistId, countryId)
            .then(response => dispatch(spotifyActions.SET_ARTIST_TOP_TRACKS, response.tracks))
            .catch(e => setError(e));
    }, []);

    const getRelatedArtists = useCallback((artistId) => {
        spotifyApi.getArtistRelatedArtists(artistId)
            .then(response => dispatch(spotifyActions.SET_ARTISTS, response.artists))
            .catch(e => setError(e));
    }, []);

    const followArtist = async (artistId) => {
        const response = await spotifyApi.followArtists([artistId]);
        return !checkIfFailed(response);
    }

    const unfollowArtist = async (artistId) => {
        const response = await spotifyApi.unfollowArtists([artistId]);
        return !checkIfFailed(response);
    }

    const isArtistFollowed = (followedArtists, artistId) => {
        const isFollowed = followedArtists.find(artist => artist.id === artistId);
        return isSavedOrFollowed(isFollowed);
    }

    const getSavedTracks = useCallback(() => {
        spotifyApi.getMySavedTracks()
            .then(response => {
                const savedTracks = response.items.map(item => item.track);
                dispatch(spotifyActions.SET_SAVED_TRACKS, savedTracks);
            })
            .catch(e => setError(e));
    }, []);

    const getTrackById = useCallback((trackId) => {
        spotifyApi.getTrack(trackId)
            .then(response => dispatch(spotifyActions.SET_TRACK, response))
            .catch(e => setError(e));
    }, [])

    const addTrackToSavedTracks = async (trackId) => {
        const response = await spotifyApi.addToMySavedTracks([trackId]);
        return !checkIfFailed(response);
    }

    const removeTrackFromSavedTracks = async (trackId) => {
        const response = await spotifyApi.removeFromMySavedTracks([trackId]);
        return !checkIfFailed(response);
    }

    const isTrackSaved = (savedTracks, trackId) => {
        const isSaved = savedTracks.find(track => trackId === track.id);
        return isSavedOrFollowed(isSaved);
    }

    const context = {
        user: spotifyState.user,
        recentlyPlayed: spotifyState.recentlyPlayed,
        newReleases: spotifyState.newReleases,
        suggestedArtists: spotifyState.suggestedArtists,
        categories: spotifyState.categories,
        recommendedTracks: spotifyState.recommendedTracks,
        topTracks: spotifyState.topTracks,
        topArtists: spotifyState.topArtists,
        userPlaylists: spotifyState.userPlaylists,
        playlist: spotifyState.playlist,
        savedAlbums: spotifyState.savedAlbums,
        album: spotifyState.album,
        albums: spotifyState.albums,
        followedArtists: spotifyState.followedArtists,
        artist: spotifyState.artist,
        artists: spotifyState.artists,
        artistAlbums: spotifyState.artistAlbums,
        artistTopTracks: spotifyState.artistTopTracks,
        savedTracks: spotifyState.savedTracks,
        track: spotifyState.track,
        error: spotifyState.error,
        getUser,
        getUserById,
        getRecentlyPlayed,
        getNewReleases,
        getSuggestedArtists,
        getCategories,
        getGenreSeeds,
        getRecommendedTracks,
        getTopTracks,
        getTopArtists,
        getUserPlaylists,
        getPlaylistById,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        followPlaylist,
        unfollowPlaylist,
        isPlaylistSaved,
        getSavedAlbums,
        getAlbumById,
        addAlbumToSavedAlbum,
        removeAlbumFromSavedAlbum,
        isAlbumSaved,
        getFollowedArtists,
        getArtistById,
        getAlbums,
        getArtistAlbums,
        getArtistTopTracks,
        getRelatedArtists,
        followArtist,
        unfollowArtist,
        isArtistFollowed,
        getSavedTracks,
        getTrackById,
        addTrackToSavedTracks,
        removeTrackFromSavedTracks,
        isTrackSaved,
    }

    return context;
}

const searchDefaultState = {
    albums: [],
    artists: [],
    playlists: [],
    tracks: [],
    shows: [],
    episodes: [],
    error: null,
}

const searchActions = {
    SET_ALBUMS: 'SET_ALBUMS',
    SET_ARTISTS: 'SET_ARTISTS',
    SET_PLAYLISTS: 'SET_PLAYLISTS',
    SET_TRACKS: 'SET_TRACKS',
    SET_SHOWS: 'SET_SHOWS',
    SET_EPISODES: 'SET_EPISODES',
    SET_ERROR: 'SET_ERROR',
}

function SearchReducer(state, action) {
    switch (action.type) {
        case searchActions.SET_ALBUMS:
            return { ...state, albums: action.value, error: null };

        case searchActions.SET_ARTISTS:
            return { ...state, artists: action.value, error: null };

        case searchActions.SET_PLAYLISTS:
            return { ...state, playlists: action.value, error: null };

        case searchActions.SET_TRACKS:
            return { ...state, tracks: action.value, error: null };

        case searchActions.SET_SHOWS:
            return { ...state, shows: action.value, error: null };

        case searchActions.SET_EPISODES:
            return { ...state, episodes: action.value, error: null };

        case searchActions.SET_ERROR:
            return { ...state, error: action.value };

        default:
            return { ...searchDefaultState };
    }
}

export const useSpotifySearch = () => {
    const [searchState, dispatchSearch] = useReducer(SearchReducer, searchDefaultState);

    const dispatch = (type, value) => {
        dispatchSearch({
            type: type,
            value: value
        });
    }

    const setError = (response) => {
        console.log(response);
        dispatchSearch({
            type: searchActions.SET_ERROR,
            value: {
                status: response.status,
                body: JSON.parse(response.responseText).error,
            }
        });
    }

    const searchByParam = useCallback((param) => {
        spotifyApi.searchAlbums(param)
            .then(response => dispatch(searchActions.SET_ALBUMS, response.albums.items))
            .catch(e => setError(e));

        spotifyApi.searchArtists(param)
            .then(response => dispatch(searchActions.SET_ARTISTS, response.artists.items))
            .catch(e => setError(e));

        spotifyApi.searchPlaylists(param)
            .then(response => dispatch(searchActions.SET_PLAYLISTS, response.playlists.items))
            .catch(e => setError(e));

        spotifyApi.searchTracks(param)
            .then(response => dispatch(searchActions.SET_TRACKS, response.tracks.items))
            .catch(e => setError(e));

        spotifyApi.searchShows(param)
            .then(response => dispatch(searchActions.SET_SHOWS, response.shows.items))
            .catch(e => setError(e));

        spotifyApi.searchEpisodes(param)
            .then(response => dispatch(searchActions.SET_EPISODES, response.episodes.items))
            .catch(e => setError(e));
    }, []);

    return {
        albums: searchState.albums,
        artists: searchState.artists,
        playlists: searchState.playlists,
        tracks: searchState.tracks,
        shows: searchState.shows,
        episodes: searchState.episodes,
        error: searchState.error,
        searchByParam,
    }
}

export const REPEAT_STATES = {
    CONTEXT: 'context',
    TRACK: 'track',
    OFF: 'off',
}

const playerDefaultState = {
    devices: [],
    device: null,
    currentlyPlaying: null,
    playbackState: null,
    error: null,
}

const playerActions = {
    SET_DEVICES: 'SET_DEVICES',
    SET_DEVICE: 'SET_DEVICE',
    SET_CURRENTLY_PLAYING: 'SET_CURRENTLY_PLAYING',
    SET_PLAYBACK_STATE: 'SET_PLAYBACK_STATE',
    SET_ERROR: 'SET_ERROR',
}

function PlayerReducer(state, action) {
    switch (action.type) {
        case playerActions.SET_DEVICES:
            return { ...state, devices: action.value, error: null }

        case playerActions.SET_DEVICE:
            return { ...state, device: action.value, error: null }

        case playerActions.SET_CURRENTLY_PLAYING:
            return { ...state, currentlyPlaying: action.value, error: null }

        case playerActions.SET_PLAYBACK_STATE:
            return { ...state, playbackState: action.value, error: null }

        case playerActions.SET_ERROR:
            return { ...playerDefaultState, error: action.value };

        default:
            return { ...playerDefaultState };
    }
}

export const usePlayer = () => {
    const [playerState, dispatchPlayer] = useReducer(PlayerReducer, playerDefaultState);

    const { currentlyPlaying } = playerState;

    const dispatch = (type, value) => {
        dispatchPlayer({
            type: type,
            value: value
        });
    }

    const setError = (response) => {
        console.log(response);
        dispatchPlayer({
            type: spotifyActions.SET_ERROR,
            value: {
                status: response.status,
                body: JSON.parse(response.responseText).error,
            }
        });
    }

    const checkIfFailed = (response) => {
        return response && response.status && response.status >= 400;
    }

    const getDevices = useCallback(() => {
        spotifyApi.getMyDevices()
            .then(response => dispatch(playerActions.SET_DEVICES, response.devices))
            .catch(e => setError(e));
    }, []);

    const transferPlayback = useCallback((deviceId = null) => {
        if (deviceId) {
            spotifyApi.transferMyPlayback([deviceId])
                .then(_ => dispatch(playerActions.SET_DEVICE, deviceId))
                .catch(e => setError(e));
        } else {
            spotifyApi.getMyDevices()
                .then(response => {
                    const devices = response.devices;

                    let deviceIds = devices.map(device => device.name.includes('Web') && device.id);

                    if (deviceIds.length > 0) {
                        spotifyApi.transferMyPlayback([deviceIds[0]])
                            .then(_ => dispatch(playerActions.SET_DEVICE, deviceIds[0]))
                            .catch(e => setError(e));
                    }
                })
                .catch(e => setError(e));
        }
    }, []);

    const fetchPlayback = useCallback(() => {
        spotifyApi.getMyCurrentPlaybackState()
            .then(response => dispatch(playerActions.SET_PLAYBACK_STATE, response))
            .catch(e => setError(e));

        spotifyApi.getMyCurrentPlayingTrack()
            .then(response => {
                if (currentlyPlaying === null || currentlyPlaying.is_playing !== response.is_playing ||
                    (currentlyPlaying.item && currentlyPlaying.item.id !== response.item.id))
                    dispatch(playerActions.SET_CURRENTLY_PLAYING, response);
            })
            .catch(e => setError(e));
    }, [currentlyPlaying]);

    const playSong = async (uris = [], position = null) => {
        let body = {}
        if (uris.length > 0) body = { ...body, uris: uris };
        if (position) body = { ...body, offset: { position: position } }

        const response = await spotifyApi.play(body);
        return !checkIfFailed(response);
    }

    const playNonSong = async (uri = null, position = null) => {
        let body = {};
        if (uri != null) body = { ...body, context_uri: uri };
        if (position != null) body = { ...body, offset: { position: position } };

        const response = await spotifyApi.play(body);
        return !checkIfFailed(response);
    }

    const pause = async () => {
        const response = await spotifyApi.pause();
        return !checkIfFailed(response);
    }

    const seek = useCallback(async (playingProgressMs) => {
        const response = await spotifyApi.seek(playingProgressMs);
        return !checkIfFailed(response);
    }, [])

    const next = async () => {
        const response = await spotifyApi.skipToNext();
        return !checkIfFailed(response);
    }

    const prev = async () => {
        const response = await spotifyApi.skipToPrevious();
        return !checkIfFailed(response);
    }

    const shuffle = async (shuffleState) => {
        const response = await spotifyApi.setShuffle(!shuffleState);
        return !checkIfFailed(response);
    }

    const repeat = async (repeatState) => {
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

        const response = await spotifyApi.setRepeat(stateNow);
        return !checkIfFailed(response);
    }

    const addToQueue = async (uri) => {
        const response = await spotifyApi.queue(uri);
        return !checkIfFailed(response);
    }

    const setVolume = async (percentageVolume) => {
        const response = await spotifyApi.setVolume(percentageVolume);
        return !checkIfFailed(response)
    }

    const mute = async () => {
        const response = await spotifyApi.setVolume(0);
        return !checkIfFailed(response);
    }

    const unmute = async (volume) => {
        const response = await spotifyApi.setVolume(volume);
        return !checkIfFailed(response);
    }

    const context = {
        devices: playerState.devices,
        device: playerState.device,
        currentlyPlaying: playerState.currentlyPlaying,
        playbackState: playerState.playbackState,
        error: playerState.error,
        getDevices,
        transferPlayback,
        fetchPlayback,
        playSong,
        playNonSong,
        pause,
        seek,
        next,
        prev,
        shuffle,
        repeat,
        addToQueue,
        setVolume,
        mute,
        unmute,
    }

    return context;
}