import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { PlayerContext } from "../../context/player-context";
import { UIContext } from "../../context/ui-context";
import { LibraryContext } from "../../context/library-context";
import { usePlayer, useSpotify } from "../../hooks/use-new-spotify";
import { usePalette } from "react-palette";
import SongRow from "../../components/song-row/SongRow";
import CircleIcon from '@mui/icons-material/Circle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreAlbum from "../../components/more-album/MoreAbum";
import Copyright from "../../components/copyright/Copyright";
import PageBodyPlayer, { FollowOptions } from "../../components/page-body-player/PageBodyPlayer";

function Album() {
    const history = useHistory();
    const idParams = history.location.pathname.split('/')[2];

    const { setBodyColor, setHeaderColor } = useContext(UIContext);
    const libraryCtx = useContext(LibraryContext);
    const { currentlyPlaying } = useContext(PlayerContext);

    const [id, setId] = useState(null);
    const [album, setAlbum] = useState(null);
    const [artist, setArtist] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState([]);

    const spotify = useSpotify();
    const { getAlbumById, getArtistById, getArtistAlbums } = spotify;
    const player = usePlayer();
    const palette = usePalette(album && album.images[0].url);

    // Retrieve ALbum Data
    const retrieveAlbumData = useCallback((id) => {
        getAlbumById(id);
    }, [getAlbumById]);

    // Retrieve Artist Data
    const retrieveArtistData = useCallback((artistId) => {
        getArtistById(artistId);
        getArtistAlbums(artistId);
    }, [getArtistById, getArtistAlbums])

    // Get Album
    useEffect(() => {
        if (idParams !== id) {
            if (idParams !== id) {
                setAlbum(null);
                setArtist(null);
                setArtistAlbums([]);
            }
            setId(idParams);
            retrieveAlbumData(idParams);
        }
    }, [idParams, id, retrieveAlbumData]);

    // Set Album && Get Artist
    useEffect(() => {
        if (album !== spotify.album) {
            retrieveArtistData(spotify.album.artists[0].id);
            setAlbum(spotify.album);
        }
    }, [album, spotify.album, retrieveArtistData]);

    // Set Artist
    useEffect(() => {
        if (artist !== spotify.artist) setArtist(spotify.artist);
        if (artistAlbums.length === 0 && spotify.artistAlbums.length > 0) setArtistAlbums(spotify.artistAlbums);
    }, [artist, spotify.artist, artistAlbums, spotify.artistAlbums]);

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
        const hours = Math.floor((timestampMS / 3600000) % 24);
        const minutes = Math.floor((timestampMS / 60000) % 60);
        const seconds = Math.floor(timestampMS / 1000) % 60;

        if (hours > 0) duration += `${hours} hr `;
        if (minutes > 0) duration += `${minutes} min `;
        if (hours === 0) duration += `${seconds} sec`

        return duration
    }

    // Play Album
    function playAlbumHandler() {
        if (currentlyPlaying && !currentlyPlaying.is_playing) player.playNonSong(album.uri)
        else player.pause()
    }

    // Follow ALbum
    async function followHandler() {
        if (!spotify.isAlbumSaved(libraryCtx.followedAlbums, album.id)) {
            libraryCtx.addFollowedAlbums(album)
            const success = await spotify.addAlbumToSavedAlbum(album.id);
            if (!success) libraryCtx.removeFollowedAlbums(album.id);
        }
        else {
            libraryCtx.removeFollowedAlbums(album.id);
            const success = await spotify.removeAlbumFromSavedAlbum(album.id);
            if (!success) libraryCtx.addFollowedAlbums(album);
        }
    }

    // Play Song
    function playSongHandler(track, position = null) {
        if (currentlyPlaying && !currentlyPlaying.is_playing) {
            if (currentlyPlaying.item.id !== track.id) player.playNonSong(album.uri, position);
            else player.playNonSong();
        } else player.pause();
    }

    console.log('RENDERING ALBUM PAGE');
    console.log(album)

    return (
        <Fragment>
            {/* Head */}
            {
                (album && currentlyPlaying) && (
                    <section
                        className="flex items-end pt-12 pb-6 px-4"
                        style={{ background: `linear-gradient(180deg, ${palette.data.muted} 0%, ${palette.data.vibrant} 50%)` }}
                    >
                        <img
                            className="w-48 h-48"
                            src={album.images[0].url}
                            alt={album.name}
                            style={{ boxShadow: '0 40px 70px 20px rgb(0 0 0 / 0.35)' }} />

                        <div className="ml-4 grid gap-1">
                            <p className="text-white font-bold text-xs">{album.type.toUpperCase()}</p>
                            <h2 className={`${album.name.length < 10 ? 'text-7xl' : 'text-5xl'} text-white font-bold tracking-tighter leading-none`}>{album.name}</h2>
                            <div className="text-sm flex items-center text-gray-300">
                                {
                                    artist && (
                                        <Fragment>
                                            <span className="flex gap-2 items-center">
                                                <img
                                                    className="h-5 w-5 rounded-full"
                                                    src={artist.images[0].url}
                                                    alt={artist.name} />
                                                <Link
                                                    className="text-white font-bold transition duration-200 ease hover:underline"
                                                    to={`/${artist.uri.split(':')[1]}/${artist.uri.split(':')[2]}`}
                                                >
                                                    {artist.name}
                                                </Link>
                                            </span>
                                            <span className={`transform scale-${25}`}><CircleIcon /></span>
                                        </Fragment>
                                    )
                                }
                                <p>{new Date(album.release_date).getFullYear()}</p>
                                <span className={`transform scale-${25}`}><CircleIcon /></span>
                                <p>{`${album.tracks.total} songs, ${getDuration(album.tracks.items.reduce((output, item) => output + item.duration_ms, 0))}`}</p>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Body */}
            {
                (album && currentlyPlaying) && (
                    <section
                        className="pb-6 px-4"
                        style={{ background: `linear-gradient(180deg, ${palette.data.vibrant} -10%, #181818 15%)` }}
                    >
                        {/* Player */}
                        <PageBodyPlayer
                            id={album.id}
                            followOption={FollowOptions.FAVORITE_BUTTON}
                            isSaved={spotify.isAlbumSaved(libraryCtx.followedAlbums, album.id)}
                            onFollow={followHandler}
                            onPlay={playAlbumHandler}
                        >
                            <div className="w-48 absolute top-6 bg-292929 text-sm text-gray-300 font-medium p-1 rounded shadow-2xl tracking-tight transition ease duration-300 transform">
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Add to queue</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Go to artist radio</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Add to Your Library</p>
                                <span className="px-2 py-1 cursor-pointer rounded flex justify-between items-center transition ease duration-200 hover:bg-white hover:bg-opacity-30">
                                    Add to playlist
                                    <PlayArrowIcon style={{ fontSize: 16 }} />
                                </span><span className="px-2 py-1 cursor-pointer rounded flex justify-between items-center transition ease duration-200 hover:bg-white hover:bg-opacity-30">
                                    Share
                                    <PlayArrowIcon style={{ fontSize: 16 }} />
                                </span>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Open in Desktop App</p>
                            </div>
                        </PageBodyPlayer>

                        {/* List of Tracks */}
                        {
                            (album && currentlyPlaying) &&
                            <SongRow
                                type={album.type}
                                songList={album.tracks.items}
                                isPlaying={currentlyPlaying.is_playing}
                                currentlyPlayingSongId={currentlyPlaying.item.id}
                                onPlaySong={playSongHandler} />
                        }

                        {/* Copyrights */}
                        <div className="grid mt-8">
                            {
                                album.copyrights.map((copyright, index) => (
                                    <Copyright key={index} type={copyright.type} text={copyright.text} />
                                ))
                            }
                        </div>

                        {/* More Album by The Same Artist */}
                        {
                            (album && artistAlbums.length > 0) && (
                                <MoreAlbum
                                    className="mt-10"
                                    artist={album.artists[0].name}
                                    albums={artistAlbums} />
                            )
                        }
                    </section>
                )
            }
        </Fragment>
    )
}

export default Album;