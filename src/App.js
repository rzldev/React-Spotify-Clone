import React, { useCallback, useContext, useEffect } from 'react';
import './App.css';
import { useHistory } from "react-router";
import { usePlayer, useSpotify, useSpotifyAPI } from './hooks/use-new-spotify';
import { AuthContext } from './context/auth-context';
import { PlayerContext } from './context/player-context';
import { LibraryContext } from './context/library-context';
import PlayerLayout from './layouts/PlayerLayout';
import ApplicationRouter from './router/ApplicationRouter';

function App() {
  const history = useHistory();

  const authCtx = useContext(AuthContext);
  const { token, setAuth, user, setUser, clearAuth } = authCtx;
  const libraryCtx = useContext(LibraryContext);
  const { playlists, setPlaylists, savedTracks, setSavedTracks, followedAlbums, setFollowedAlbums, followedArtists, setFollowedArtists, topTracks, setTopTracks, topArtists, setTopArtists } = libraryCtx;
  const playerCtx = useContext(PlayerContext);
  const { devices, setDevices } = playerCtx

  const spotifyApi = useSpotifyAPI();
  const { setToken } = useSpotifyAPI();
  const spotify = useSpotify();
  const { getUser, getUserPlaylists, getSavedTracks, getSavedAlbums, getFollowedArtists, getTopTracks, getTopArtists } = spotify;
  const player = usePlayer();
  const { getDevices, transferPlayback, fetchPlayback } = player;

  // Retrieve Data
  const retrieveInitialData = useCallback(() => {
    if (token) {
      setToken(token);
      getUser();
      getUserPlaylists();
      getSavedTracks();
      getSavedAlbums();
      getTopTracks();
      getTopArtists();
      
      getFollowedArtists();
      if (devices.length < 1) {
        getDevices();
        transferPlayback();
        fetchPlayback();
      }
    }
  }, [token, setToken, getUser, getUserPlaylists, getSavedTracks, getSavedAlbums, getFollowedArtists, getTopTracks, getTopArtists, 
    devices, getDevices, transferPlayback, fetchPlayback]);

  // Get Token
  useEffect(() => {
    const hash = spotifyApi.getTokenFromResponse();

    if (hash.access_token && !token) {
      setAuth(hash.access_token);
      history.push('/');
    }
    else if (!hash.access_token && !token) {
      history.push('/');
    }
  }, [spotifyApi, setAuth, token, history]);

  // Fetch Initial Data
  useEffect(() => {
    retrieveInitialData();
  }, [retrieveInitialData]);

  // Set Initial Data
  useEffect(() => {
    if (user === null && spotify.user) setUser(spotify.user);

    if (playlists.length === 0 && spotify.userPlaylists.length > 0) setPlaylists(spotify.userPlaylists);

    if (savedTracks.length === 0 && spotify.savedTracks.length > 0) setSavedTracks(spotify.savedTracks);

    if (followedAlbums.length === 0 && spotify.savedAlbums > 0) setFollowedAlbums(spotify.savedAlbums);

    if (followedArtists.length === 0 && spotify.followedArtists > 0) setFollowedArtists(spotify.followedArtists);

    if (devices.length === 0 && player.devices.length > 0) setDevices(player.devices);

    if (topTracks.length === 0 && spotify.topTracks.length > 0) setTopTracks(spotify.topTracks);

    if (topArtists.length === 0 && spotify.topArtists.length > 0) setTopArtists(spotify.topArtists);

    if (spotify.error !== null) {
      if (spotify.error.status === 401) console.log(spotify.error);
      if (spotify.error.status === 403 || spotify.error.status === 401) {
        clearAuth();
        history.push('/');
      }
    }
  }, [user, setUser, playlists, setPlaylists, savedTracks, setSavedTracks, followedAlbums, setFollowedAlbums, followedArtists, setFollowedArtists, devices, setDevices,
    spotify.user, spotify.userPlaylists, spotify.savedTracks, spotify.savedAlbums, spotify.followedArtists, player.devices, topTracks, spotify.topTracks, setTopTracks, topArtists, spotify.topArtists, setTopArtists, 
    spotify.error, clearAuth, history]);

  return (
    <PlayerLayout>
      <ApplicationRouter />
    </PlayerLayout>
  );
}

export default App;
