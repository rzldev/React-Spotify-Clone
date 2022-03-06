import React, { useCallback, useReducer } from "react";

const libraryInitialState = {
    playlists: [],
    savedTracks: [],
    followedAlbums: [],
    followedArtists: [],
    recentlyPlayed: [],
    categories: [],
    newReleases: [],
    suggestedArtists: [],
    topTracks: [],
    topArtists: [],
}

export const LibraryContext = React.createContext({
    ...libraryInitialState,
    setPlaylists: (playlists) => { },
    addPlaylist: (playlist) => { },
    removePlaylist: (playlistId) => { },
    setSavedTracks: (tracks) => { },
    addSavedTrack: (track) => { },
    removeSavedTrack: (trackId) => { },
    setFollowedAlbums: (albums) => { },
    addFollowedAlbums: (album) => { },
    removeFollowedAlbums: (albumId) => { },
    setFollowedArtists: (artists) => { },
    addFollowedArtists: (artist) => { },
    removeFollowedArtists: (artistId) => { },
    setRecentlyPlayed: (recentlyPlayed) => { },
    addRecentlyPlayed: (recentlyPlayed) => { },
    setCategories: (categories) => { },
    addCategory: (category) => { },
    setNewReleases: (newReleases) => { },
    addNewRelease: (newRelease) => { },
    setSuggestedArtists: (seuggestedArtists) => { },
    addSuggestedArtist: (suggestedArtist) => { },
    setTopTracks: (tracks) => {},
    setTopArtists: (artists) => {},
});

function validateAndAddItem(oldArray, newArray) {
    const temp = oldArray;
    newArray.map(newItem => (!temp.reduce((output, item) => output || (item.id === newItem.id), false)) && temp.push(newItem));
    return temp;
}

const libraryActionTypes = {
    SET_PLAYLISTS: 'SET_PLAYLISTS',
    ADD_PLAYLIST: 'ADD_PLAYLIST',
    REMOVE_PLAYLIST: 'REMOVE_PLAYLIST',
    SET_SAVED_TRACKS: 'SET_SAVED_TRACKS',
    ADD_SAVED_TRACK: 'ADD_SAVED_TRACK',
    REMOVE_SAVED_TRACK: 'REMOVE_SAVED_TRACK',
    SET_FOLLOWED_ALBUMS: 'SET_FOLLOWED_ALBUMS',
    ADD_FOLLOWED_ALBUMS: 'ADD_FOLLOWED_ALBUMS',
    REMOVE_FOLLOWED_ALBUMS: 'REMOVE_FOLLOWED_ALBUMS',
    SET_FOLLOWED_ARTISTS: 'SET_FOLLOWED_ARTISTS',
    ADD_FOLLOWED_ARTISTS: 'ADD_FOLLOWED_ARTISTS',
    REMOVE_FOLLOWED_ARTISTS: 'REMOVE_FOLLOWED_ARTISTS',
    SET_RECENTLY_PLAYED: 'SET_RECENTLY_PLAYED',
    ADD_RECENTLY_PLAYED: 'ADD_RECENTLY_PLAYED',
    SET_CATEGORIES: 'SET_CATEGORIES',
    ADD_CATEGORY: 'ADD_CATEGORY',
    SET_NEW_RELEASES: 'SET_NEW_RELEASES',
    ADD_NEW_RELEASE: 'ADD_NEW_RELEASE',
    SET_SUGGESTED_ARTISTS: 'SET_SUGGESTED_ARTISTS',
    ADD_SUGGESTED_ARTIST: 'ADD_SUGGESTED_ARTIST',
    SET_TOP_TRACKS: 'SET_TOP_TRACKS',
    SET_TOP_ARTISTS: 'SET_TOP_ARTISTS',
}

function libraryReducer(state, action) {
    switch (action.type) {
        case libraryActionTypes.SET_PLAYLISTS:
            const tempPlaylists = validateAndAddItem(state.playlists, action.value);
            return { ...state, playlists: tempPlaylists };

        case libraryActionTypes.ADD_PLAYLIST:
            const playlistsTemp = validateAndAddItem(state.playlists, [action.value]);
            return { ...state, playlists: playlistsTemp };

        case libraryActionTypes.REMOVE_PLAYLIST:
            const removedPlaylistsTemp = state.playlists.filter(item => item.id !== action.value);
            return { ...state, playlists: removedPlaylistsTemp };

        case libraryActionTypes.SET_SAVED_TRACKS:
            const tempSavedTracks = validateAndAddItem(state.savedTracks, action.value);
            return { ...state, savedTracks: tempSavedTracks };

        case libraryActionTypes.ADD_SAVED_TRACK:
            const savedTracksTemp = validateAndAddItem(state.savedTracks, [action.value]);
            return { ...state, savedTracks: savedTracksTemp };

        case libraryActionTypes.REMOVE_SAVED_TRACK:
            const removedSavedTracksTemp = state.savedTracks.filter(track => track.id !== action.value);
            return { ...state, savedTracks: removedSavedTracksTemp };

        case libraryActionTypes.SET_FOLLOWED_ALBUMS:
            const followedAlbumsTemp = validateAndAddItem(state.followedAlbums, action.value);
            return { ...state, followedAlbums: followedAlbumsTemp };

        case libraryActionTypes.ADD_FOLLOWED_ALBUMS:
            const addFollowedAlbumsTemp = validateAndAddItem(state.followedAlbums, [action.value]);
            return { ...state, followedAlbums: addFollowedAlbumsTemp };

        case libraryActionTypes.REMOVE_FOLLOWED_ALBUMS:
            const removeFollowedAlbumsTemp = state.followedAlbums.filter(track => track.id !== action.value);
            return { ...state, followedAlbums: removeFollowedAlbumsTemp };

        case libraryActionTypes.SET_FOLLOWED_ARTISTS:
            const followedArtistsTemp = validateAndAddItem(state.followedArtists, action.value);
            return { ...state, followedArtists: followedArtistsTemp };

        case libraryActionTypes.ADD_FOLLOWED_ARTISTS:
            const addFollowedArtistsTemp = validateAndAddItem(state.followedArtists, [action.value]);
            return { ...state, followedArtists: addFollowedArtistsTemp };

        case libraryActionTypes.REMOVE_FOLLOWED_ARTISTS:
            const removeFollowedArtistsTemp = state.followedArtists.filter(track => track.id !== action.value);
            return { ...state, followedArtists: removeFollowedArtistsTemp };

        case libraryActionTypes.SET_RECENTLY_PLAYED:
            const tempRecentlyPlayed = validateAndAddItem(state.recentlyPlayed, action.value);
            return { ...state, recentlyPlayed: tempRecentlyPlayed };

        case libraryActionTypes.ADD_RECENTLY_PLAYED:
            const recentlyPlayedTemp = validateAndAddItem(state.recentlyPlayed, [action.value]);
            return { ...state, recentlyPlayed: recentlyPlayedTemp };

        case libraryActionTypes.SET_CATEGORIES:
            const tempCategories = validateAndAddItem(state.categories, action.value);
            return { ...state, categories: tempCategories };

        case libraryActionTypes.ADD_CATEGORY:
            const categoriesTemp = validateAndAddItem(state.categories, [action.value]);
            return { ...state, categories: categoriesTemp };

        case libraryActionTypes.SET_NEW_RELEASES:
            const tempNewReleases = validateAndAddItem(state.newReleases, action.value);
            return { ...state, newReleases: tempNewReleases };

        case libraryActionTypes.ADD_NEW_RELEASE:
            const newReleasesTemp = validateAndAddItem(state.newReleases, [action.value]);
            return { ...state, newReleases: newReleasesTemp };

        case libraryActionTypes.SET_SUGGESTED_ARTISTS:
            const tempSuggestedArtists = validateAndAddItem(state.suggestedArtists, action.value);
            return { ...state, suggestedArtists: tempSuggestedArtists };

        case libraryActionTypes.ADD_SUGGESTED_ARTIST:
            const suggestedArtistsTemp = validateAndAddItem(state.suggestedArtists, [action.value]);
            return { ...state, suggestedArtists: suggestedArtistsTemp };

        case libraryActionTypes.SET_TOP_TRACKS:
            const topTracksTemp = validateAndAddItem(state.topTracks, action.value);
            return { ...state, topTracks: topTracksTemp };

        case libraryActionTypes.SET_TOP_ARTISTS:
            const topArtistsTemp = validateAndAddItem(state.topArtists, action.value);
            return { ...state, topArtists: topArtistsTemp };

        default:
            return { ...libraryInitialState }
    }
}

function LibraryContextProvider(props) {
    const [libraryState, dispatchLibrary] = useReducer(libraryReducer, libraryInitialState);

    const setPlaylists = useCallback((playlists) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_PLAYLISTS,
            value: playlists,
        });
    }, []);

    const addPlaylist = useCallback((playlist) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_PLAYLIST,
            value: playlist,
        });
    }, []);

    const removePlaylist = useCallback((playlistId) => {
        dispatchLibrary({
            type: libraryActionTypes.REMOVE_PLAYLIST,
            value: playlistId,
        })
    }, []);

    const setSavedTracks = useCallback((tracks) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_SAVED_TRACKS,
            value: tracks,
        });
    }, []);

    const addSavedTrack = useCallback((track) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_SAVED_TRACK,
            value: track,
        });
    }, []);

    const removeSavedTrack = useCallback((trackId) => {
        dispatchLibrary({
            type: libraryActionTypes.REMOVE_SAVED_TRACK,
            value: trackId,
        })
    }, []);

    const setFollowedAlbums = useCallback((albums) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_FOLLOWED_ALBUMS,
            value: albums,
        });
    }, []);

    const addFollowedAlbums = useCallback((album) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_FOLLOWED_ALBUMS,
            value: album,
        });
    }, []);

    const removeFollowedAlbums = useCallback((albumId) => {
        dispatchLibrary({
            type: libraryActionTypes.REMOVE_FOLLOWED_ALBUMS,
            value: albumId,
        })
    }, []);

    const setFollowedArtists = useCallback((artists) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_FOLLOWED_ARTISTS,
            value: artists,
        });
    }, []);

    const addFollowedArtists = useCallback((artist) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_FOLLOWED_ARTISTS,
            value: artist,
        });
    }, []);

    const removeFollowedArtists = useCallback((artistId) => {
        dispatchLibrary({
            type: libraryActionTypes.REMOVE_FOLLOWED_ARTISTS,
            value: artistId,
        })
    }, []);

    const setRecentlyPlayed = useCallback((recentlyPlayed) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_RECENTLY_PLAYED,
            value: recentlyPlayed,
        });
    }, []);

    const addRecentlyPlayed = useCallback(recentlyPlayed => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_RECENTLY_PLAYED,
            value: recentlyPlayed
        })
    }, [])

    const setCategories = useCallback((categories) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_CATEGORIES,
            value: categories,
        });
    }, []);

    const addCategory = useCallback((category) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_CATEGORY,
            value: category,
        });
    }, []);

    const setNewReleases = useCallback((newReleases) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_NEW_RELEASES,
            value: newReleases,
        });
    }, []);

    const addNewRelease = useCallback((newRelease) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_NEW_RELEASE,
            value: newRelease,
        });
    }, []);

    const setSuggestedArtists = useCallback((suggestedArtists) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_SUGGESTED_ARTISTS,
            value: suggestedArtists,
        });
    }, []);

    const addSuggestedArtist = useCallback((suggestedArtist) => {
        dispatchLibrary({
            type: libraryActionTypes.ADD_SUGGESTED_ARTIST,
            value: suggestedArtist,
        });
    }, []);

    const setTopTracks = useCallback((tracks) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_TOP_TRACKS,
            value: tracks
        })
    }, []);

    const setTopArtists = useCallback((artists) => {
        dispatchLibrary({
            type: libraryActionTypes.SET_TOP_ARTISTS,
            value: artists,
        })
    }, []);

    const context = {
        ...libraryState,
        setPlaylists,
        addPlaylist,
        removePlaylist,
        setSavedTracks,
        addSavedTrack,
        removeSavedTrack,
        setFollowedAlbums,
        addFollowedAlbums,
        removeFollowedAlbums,
        setFollowedArtists,
        addFollowedArtists,
        removeFollowedArtists,
        setRecentlyPlayed,
        addRecentlyPlayed,
        setCategories,
        addCategory,
        setNewReleases,
        addNewRelease,
        setSuggestedArtists,
        addSuggestedArtist,
        setTopTracks,
        setTopArtists,
    }

    return (
        <LibraryContext.Provider value={context}>
            {props.children}
        </LibraryContext.Provider>
    )
}

export default LibraryContextProvider