import { useCallback, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { AuthContext } from "../context/auth-context";
import { LibraryContext } from "../context/library-context";

export const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT;
const redirectUri = 'http://localhost:3000/'
const clientId = process.env.REACT_APP_CLIENT_ID

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

const spotifyApi = new SpotifyWebApi();

function useSpotify() {
    const accessUri = `${authEndpoint}?response_type=token&client_id=${clientId}&scope=${scopes.join("%20")}&redirect_uri=${redirectUri}&show_dialog=true`;

    const { setUser, clearAuth } = useContext(AuthContext);
    const libraryCtx = useContext(LibraryContext);
    const {
        playlists, savedTracks, followedAlbums, followedArtists, setPlaylists, setRecentlyPlayed, setNewReleases, setSuggestedArtists,
        setSavedTracks, addSavedTrack, removeSavedTrack, setCategories, addPlaylist, removePlaylist,
        setFollowedAlbums, setFollowedArtists, addFollowedAlbums, removeFollowedAlbums, addFollowedArtists, removeFollowedArtists,
    } = libraryCtx;

    /* http://localhost:3000/#access_token=token&token_type=Bearer&expires_in=3600 */
    const getTokenFromResponse = useCallback(() => {
        return window.location.hash
            .substring(1)
            .split('&').reduce((init, item) => {
                let parts = item.split('=');
                init[parts[0]] = decodeURIComponent(parts[1]);
                return init
            }, {});
    }, []);

    // Set Token
    const setAccessToken = (token) => {
        spotifyApi.setAccessToken(token);
    }

    // Get Token
    const getAccessToken = () => {
        return spotifyApi.getAccessToken();
    }

    // User
    const getUser = useCallback(() => {
        spotifyApi.getMe()
            .then(response => setUser(response))
            .catch(e => e.status === 401 && clearAuth());
    }, [setUser, clearAuth]);

    // Playlists
    const getPlaylists = useCallback(() => {
        spotifyApi.getUserPlaylists()
            .then(response => setPlaylists(response.items))
            .catch(e => e.status === 401 && clearAuth());
    }, [setPlaylists, clearAuth]);

    // Playlist
    async function getPlaylist(id) {
        try {
            const playlistResponse = await spotifyApi.getPlaylist(id);
            if (playlistResponse.status >= 400) throw new Error(playlistResponse);
            return playlistResponse;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // Add to Playlist
    async function addToPlaylist(playlistId, uris) {
        const response = await spotifyApi.addTracksToPlaylist(playlistId, uris);
        return response;
    }

    // Remove from Playlist
    async function removeFromPlaylist(playlistId, uris) {
        const response = await spotifyApi.removeTracksFromPlaylist(playlistId, uris);
        return response;
    }

    // Get Track Recommendations
    const getRecommendations = useCallback(async (seedArtists = [], seedTracks = []) => {
        const response = await spotifyApi
            .getRecommendations({
                seed_artists: seedArtists.join(','),
                seed_tracks: seedTracks.join(','),
                limit: 10,
            });

        return response;
    }, []);

    // Follow Playlist
    const followPlaylist = useCallback(async (playlist) => {
        addPlaylist(playlist);

        spotifyApi.followPlaylist(playlist.id)
            .catch(_ => removePlaylist(playlist));
    }, [addPlaylist, removePlaylist]);

    // Unfollow Playlist
    const unfollowPlaylist = useCallback(async (playlist) => {
        removePlaylist(playlist);

        spotifyApi.unfollowPlaylist(playlist.id)
            .catch(_ => addPlaylist(playlist));
    }, [addPlaylist, removePlaylist]);

    // Check Is Playlist Followed
    const isPlaylistFollowed = useCallback((playlistId) => {
        const isFollowed = playlists.find(playlist => playlist.id === playlistId);
        return isFollowed;
    }, [playlists]);

    // Recently Played
    const getRecentlyPlayed = useCallback(() => {
        let recentlyPlayedTracks = [];
        let recentlyPlayedTemp = [];

        spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 })
            .then((recentlyPlayedResponse) => {
                recentlyPlayedResponse.items.map(item => {
                    if (item.context === null)
                        return 0;
                    const itemFound = recentlyPlayedTracks.find(track => track.context.uri === item.context.uri);
                    return !itemFound && recentlyPlayedTracks.unshift(item);
                });

                recentlyPlayedTracks.map(item => {
                    const id = item.context.uri.split(':')[2];

                    switch (item.context.type) {
                        case 'playlist':
                            spotifyApi.getPlaylist(id)
                                .then(playlist => recentlyPlayedTemp.unshift(playlist))
                                .finally(() => (recentlyPlayedTemp.length === recentlyPlayedTracks.length) && setRecentlyPlayed(recentlyPlayedTemp))
                                .catch(e => console.log(e));
                            break;

                        case 'album':
                            spotifyApi.getAlbum(id)
                                .then(album => recentlyPlayedTemp.unshift(album))
                                .finally(() => (recentlyPlayedTemp.length === recentlyPlayedTracks.length) && setRecentlyPlayed(recentlyPlayedTemp))
                                .catch(e => console.log(e));
                            break;

                        default:
                            break;
                    }

                    return true;
                });
            })
            .catch(e => console.log(e));
    }, [setRecentlyPlayed])

    // New Releases
    const getNewReleases = useCallback(() => {
        spotifyApi.getNewReleases().then((response) => {
            setNewReleases(response.albums.items)
        });
    }, [setNewReleases])

    // Suggested Artist
    const getSuggestedArtists = useCallback(() => {
        spotifyApi.getMyTopArtists().then(artists => {
            setSuggestedArtists(artists.items);
        });
    }, [setSuggestedArtists])

    // Saved Tracks
    const getSavedTracks = useCallback(async () => {
        try {
            const savedTracks = [];
            const response = await spotifyApi.getMySavedTracks();

            response.items.map(item => savedTracks.push(item.track));
            setSavedTracks(savedTracks);
        } catch (e) {
            console.log(e);
            (e.status && e.status === 401) && clearAuth();
        }
    }, [setSavedTracks, clearAuth]);

    // Followed Albums
    const getFollowedAlbums = useCallback(() => {
        spotifyApi.getMySavedAlbums()
            .then(response => setFollowedAlbums(response.items))
            .catch(e => console.log(e));
    }, [setFollowedAlbums]);

    // Follow Album
    const followAlbum = useCallback((album) => {
        addFollowedAlbums(album)

        spotifyApi.addToMySavedAlbums([album.id])
            .catch(_ => removeFollowedAlbums(album.id));
    }, [addFollowedAlbums, removeFollowedAlbums]);

    // Un-Follow Album
    const unfollowAlbum = useCallback((album) => {
        removeFollowedAlbums(album.id)

        spotifyApi.removeFromMySavedAlbums([album.id])
            .catch(_ => addFollowedAlbums(album));
    }, [addFollowedAlbums, removeFollowedAlbums])


    // Follow Artist
    const followArtist = useCallback((artist) => {
        addFollowedArtists(artist)

        spotifyApi.followArtists([artist.id])
            .catch(_ => removeFollowedArtists(artist.id));
    }, [addFollowedArtists, removeFollowedArtists]);

    // Un-Follow Artist
    const unfollowArtist = useCallback((artist) => {
        removeFollowedArtists(artist.id)

        spotifyApi.unfollowArtists([artist.id])
            .catch(_ => addFollowedArtists(artist));
    }, [addFollowedArtists, removeFollowedArtists])

    // Followed Artists
    const getFollowedArtists = useCallback(() => {
        spotifyApi.getFollowedArtists()
            .then(response => setFollowedArtists(response.artists.items))
            .catch(e => console.log(e));
    }, [setFollowedArtists]);

    // Fetch User Data
    const fetchUserData = useCallback(() => {
        getUser();
        getPlaylists();
        getSavedTracks();
        getFollowedAlbums();
        getFollowedArtists();
    }, [getUser, getPlaylists, getSavedTracks, getFollowedAlbums, getFollowedArtists]);

    // Fetch Home data
    const fetchHomeData = useCallback(() => {
        getRecentlyPlayed();
        getNewReleases();
        getSuggestedArtists();
    }, [getRecentlyPlayed, getNewReleases, getSuggestedArtists]);

    // Check Is Track Saved
    const isTrackSaved = (trackId) => {
        return savedTracks.reduce((output, track) => output || (trackId === track.id), false)
    }

    // Save Track
    const addToSavedTrack = (track) => {
        addSavedTrack(track)

        spotifyApi.addToMySavedTracks([track.id])
            .catch(e => {
                removeSavedTrack(track.id);
                e.status === 401 && clearAuth();
            });
    }

    // Remove Track
    const removeFromSavedTrack = (track) => {
        removeSavedTrack(track.id)

        spotifyApi.removeFromMySavedTracks([track.id])
            .catch(e => {
                addSavedTrack(track);
                e.status === 401 && clearAuth();
            });
    }

    // Get Categories
    const getCategories = useCallback(() => {
        spotifyApi.getCategories({ limit: 50 })
            .then(response => setCategories(response.categories.items))
            .catch(e => {
                e.status === 401 && clearAuth();
            });
    }, [setCategories, clearAuth]);

    // Get Album By ID
    const getAlbum = useCallback(async (albumId) => {
        const response = await spotifyApi.getAlbum(albumId);
        return response;
    }, []);

    // Check If Album Is Followed
    const isAlbumFollowed = useCallback((albumId) => {
        const isExist = followedAlbums.find(album => album.id === albumId);
        return isExist ? true : false;
    }, [followedAlbums]);

    // Get Artist By ID
    const getArtist = useCallback(async (artistId) => {
        const response = await spotifyApi.getArtist(artistId);
        return response;
    }, []);

    // Check If Artist Is Followed
    const isArtistFollowed = useCallback((artistId) => {
        const isExist = followedArtists.find(artist => artist.id === artistId);
        return isExist ? true : false;
    }, [followedArtists]);

    // Get Artist's Albums
    const getArtistAlbums = useCallback(async (artistId) => {
        const response = await spotifyApi.getArtistAlbums(artistId);
        return response;
    }, [])

    return {
        accessUri,
        getTokenFromResponse,
        setAccessToken,
        getAccessToken,
        getUser,
        getPlaylists,
        getRecommendations,
        getPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        followPlaylist,
        unfollowPlaylist,
        isPlaylistFollowed,
        getRecentlyPlayed,
        getNewReleases,
        getSuggestedArtists,
        getSavedTracks,
        getFollowedAlbums,
        getFollowedArtists,
        getCategories,
        fetchUserData,
        fetchHomeData,
        isTrackSaved,
        addToSavedTrack,
        removeFromSavedTrack,
        followAlbum,
        unfollowAlbum,
        followArtist,
        unfollowArtist,
        getAlbum,
        isAlbumFollowed,
        getArtist,
        isArtistFollowed,
        getArtistAlbums,
    }
}

export default useSpotify;