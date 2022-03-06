import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { usePalette } from 'react-palette';
import { UIContext } from "../../context/ui-context";
import CircleIcon from '@mui/icons-material/Circle';
import { PlayerContext } from "../../context/player-context";
import { AuthContext } from "../../context/auth-context";
import SongRow from "../../components/song-row/SongRow";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RecommendedSongs from "../../components/recommended-songs/RecommendedSongs";
import { usePlayer, useSpotify } from "../../hooks/use-new-spotify";
import { LibraryContext } from "../../context/library-context";
import PageBodyPlayer, { FollowOptions } from "../../components/page-body-player/PageBodyPlayer";

function Playlist() {
    const history = useHistory();
    const idParams = history.location.pathname.split('/')[2];

    const { user } = useContext(AuthContext);
    const { setBodyColor, setHeaderColor } = useContext(UIContext);
    const { currentlyPlaying } = useContext(PlayerContext);
    const libraryCtx = useContext(LibraryContext);

    const [id, setId] = useState(null);
    const [fetchPlaylist, setFetchPlaylist] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [refreshRecommendations, setRefreshRecommendations] = useState(true);

    const spotify = useSpotify();
    const { getPlaylistById, getRecommendedTracks } = spotify;
    const player = usePlayer();
    const palette = usePalette(playlist && playlist.tracks.items[0].track.album.images[0].url);

    // Retrieve PLaylist Data
    const retrievePlaylistData = useCallback((id) => {
        getPlaylistById(id);
    }, [getPlaylistById])

    // Retrieve Recommendation Data
    const retrieveRecommendationData = useCallback(() => {
        const seedArtists = [];
        const seedTracks = [];
        const tracks = playlist.tracks.items;

        tracks.map(_ => {
            const randomArtist = parseInt(Math.random() * 10);
            const randomTrack = parseInt(Math.random() * 10);
            const artistId = tracks[randomArtist].track.artists[0].id;
            const trackId = tracks[randomTrack].track.artists[0].id;

            if (seedArtists.length === 0) return seedArtists.push(artistId);
            if (seedTracks.length === 0) return seedTracks.push(trackId);

            const artistIsExists = seedArtists.find(item => item === artistId);
            if (!artistIsExists && seedArtists.length < 2) seedArtists.push(artistId);

            const trackIsExists = seedTracks.find(item => item === trackId);
            if (!trackIsExists && seedTracks.length < 3) seedTracks.push(trackId);

            return true;
        });

        getRecommendedTracks(seedArtists, seedTracks);
    }, [playlist, getRecommendedTracks]);

    // Get Playlist Data
    useEffect(() => {
        if (idParams !== id || fetchPlaylist) {
            if (idParams !== id) setPlaylist(null);
            setFetchPlaylist(false);
            setId(idParams)
            retrievePlaylistData(idParams)
        };
    }, [id, idParams, fetchPlaylist, retrievePlaylistData]);

    // Get Recommended Tracks
    useEffect(() => {
        if (playlist && refreshRecommendations) {
            retrieveRecommendationData();
            setRefreshRecommendations(false);
        }
    }, [playlist, refreshRecommendations, retrieveRecommendationData]);

    // Set Data
    useEffect(() => {
        if (spotify.playlist !== playlist) setPlaylist(spotify.playlist);
        if (spotify.recommendedTracks !== recommendations) setRecommendations(spotify.recommendedTracks);
    }, [playlist, spotify.playlist, spotify.recommendedTracks, recommendations])

    // Set Background Color
    useEffect(() => {
        if (palette.data) {
            setBodyColor(palette.data.muted);
            setHeaderColor(palette.data.vibrant);
        }
    }, [palette, setBodyColor, setHeaderColor])

    // Get Duration
    const getDuration = (timestampMS) => {
        let duration = '';
        const hours = new Date(timestampMS).getHours();
        const minutes = new Date(timestampMS).getMinutes();
        const seconds = new Date(timestampMS).getSeconds();

        if (hours > 0) duration += `${hours} hr `;
        if (minutes > 0) duration += `${minutes} min`;
        if (hours === 0) duration += `${seconds} secs`

        return duration
    }

    // Follow Playlist
    async function followHandler() {
        if (!spotify.isPlaylistSaved(libraryCtx.playlists, playlist.id)) {
            libraryCtx.addPlaylist(playlist);
            const success = await spotify.followPlaylist(playlist.id);
            if (!success) libraryCtx.removePlaylist(playlist.id);
        } else {
            libraryCtx.removePlaylist(playlist.id);
            const success = await spotify.unfollowPlaylist(playlist.id);
            if (!success) libraryCtx.addPlaylist(playlist);
        }
    }

    // Play Playlist
    function playPlaylistHandler() {
        if (currentlyPlaying && !currentlyPlaying.is_playing) player.playNonSong(playlist.uri)
        else player.pause()
    }

    // Play Song
    function playSongHandler(track, position) {
        if (currentlyPlaying && !currentlyPlaying.is_playing) {
            if (currentlyPlaying.item.id !== track.id) player.playSong(playlist.uri, position);
            else player.playSong();
        } else player.pause();
    }

    // Is Track Inside Playlist
    const isTrackAlreadyInPlaylist = (trackUri) => {
        const tracks = playlist.tracks.items;
        const isExist = tracks.find(track => track.track.uri === trackUri);
        return isExist ? true : false;
    }

    // Add Track To Playlist
    async function addIntoPlaylistHandler(trackUri) {
        const isTrackExist = isTrackAlreadyInPlaylist(trackUri);

        if (!isTrackExist) {
            const success = await spotify.addTrackToPlaylist(playlist.id, [trackUri]);
            if (success) setFetchPlaylist(true);
        } else {
            const success = await spotify.removeTrackFromPlaylist(playlist.id, [trackUri]);
            if (success) setFetchPlaylist(true);
        }
    }

    // Refresh Recommendation
    function refreshRecommendationsHandler() {
        setRefreshRecommendations(true);
    }

    console.log('RENDERING PLAYLIST PAGE');

    return (
        <React.Fragment>
            {/* Head */}
            {
                (playlist && currentlyPlaying) && (
                    <section
                        className="flex items-end pt-12 pb-6 px-4"
                        style={{ background: `linear-gradient(180deg, ${palette.data.muted} 0%, ${palette.data.vibrant} 50%)` }}
                    >
                        <img
                            className="w-48 h-48"
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            style={{ boxShadow: '0 40px 70px 20px rgb(0 0 0 / 0.35)' }} />

                        <div className="ml-4">
                            <p className="text-white font-bold text-xs">{playlist.type.toUpperCase()}</p>
                            <h2 className="text-7xl text-white font-bold">{playlist.name}</h2>
                            <div className="text-sm flex items-center text-gray-300">
                                <label className="text-white font-bold">{playlist.owner.display_name}</label>
                                <span className={`transform scale-${25}`}><CircleIcon /></span>
                                {
                                    (playlist.owner.id !== user.id && playlist.followers.total > 0) && (
                                        <Fragment>
                                            <p>{playlist.followers.total.toLocaleString()} likes</p>
                                            <span className={`transform scale-${25}`}><CircleIcon /></span>
                                        </Fragment>
                                    )
                                }
                                <p>{`${playlist.tracks.total} songs, ${getDuration(playlist.tracks.items.reduce((output, item) => output + item.track.duration_ms, 0))}`}</p>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Body */}
            {
                (playlist && currentlyPlaying) && (
                    <section
                        className="pb-6 px-4"
                        style={{ background: `linear-gradient(180deg, ${palette.data.vibrant} -10%, #181818 15%)` }}
                    >
                        {/* Player */}
                        <PageBodyPlayer
                            id={playlist.id}
                            isSaved={spotify.isPlaylistSaved(libraryCtx.playlists, playlist.id)}
                            followOption={(user.id !== playlist.owner.id) && FollowOptions.FAVORITE_BUTTON}
                            onFollow={followHandler}
                            onPlay={playPlaylistHandler}
                        >
                            <div className="w-48 absolute top-6 bg-292929 text-sm text-gray-300 font-medium p-1 rounded shadow-2xl tracking-tight transition ease duration-300 transform">
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Add to queue</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Go to playlist radio</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Add to profile</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Remove from Your Library</p>
                                <span className="px-2 py-1 cursor-pointer rounded flex justify-between items-center transition ease duration-200 hover:bg-white hover:bg-opacity-30">
                                    Share
                                    <PlayArrowIcon style={{ fontSize: 16 }} />
                                </span>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">About reccomendations</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Open in Desktop App</p>
                            </div>
                        </PageBodyPlayer>

                        {/* List of Tracks */}
                        {
                            (playlist && currentlyPlaying) &&
                            <SongRow
                                type={playlist.type}
                                songList={playlist.tracks.items}
                                isPlaying={currentlyPlaying.is_playing}
                                currentlyPlayingSongId={currentlyPlaying.item.id}
                                onPlaySong={playSongHandler} />
                        }

                        {/* Recommendations */}
                        {
                            (recommendations && currentlyPlaying && user.display_name === playlist.owner.display_name) &&
                            <RecommendedSongs
                                className="mt-16"
                                recommendations={recommendations.tracks}
                                isPlaying={currentlyPlaying.is_playing}
                                currentlyPlayingSongId={currentlyPlaying.item.id}
                                isTrackExist={isTrackAlreadyInPlaylist}
                                onAddIntoPlaylist={addIntoPlaylistHandler}
                                onRefresh={refreshRecommendationsHandler} />
                        }
                    </section>
                )
            }
        </React.Fragment>
    )
}

export default Playlist;