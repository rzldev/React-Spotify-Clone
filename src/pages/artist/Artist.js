import React, { useCallback, useContext, useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { usePalette } from "react-palette";
import { useHistory } from "react-router-dom";
import { usePlayer, useSpotify } from "../../hooks/use-new-spotify";
import { UIContext } from "../../context/ui-context";
import PageBodyPlayer, { FollowOptions } from "../../components/page-body-player/PageBodyPlayer";
import { LibraryContext } from "../../context/library-context";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { PlayerContext } from "../../context/player-context";
import ArtistRow, { RowType } from "../../components/artist-row/ArtistRow";
import AboutArtist from "../../components/about-artist/AboutArtist";

function Artist() {
    const history = useHistory();
    const idParams = history.location.pathname.split('/')[2];

    const { setBodyColor, setHeaderColor } = useContext(UIContext);
    const libraryCtx = useContext(LibraryContext);
    const playerCtx = useContext(PlayerContext);
    const { currentlyPlaying } = playerCtx;

    const [id, setId] = useState(null);
    const [artist, setArtist] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [popularAlbums, setPopularAlbums] = useState([]);
    const [artistAlbums, setArtistAlbums] = useState([]);
    const [artistSingles, setArtistSingles] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);

    const spotify = useSpotify();
    const { getArtistById, isArtistFollowed, getArtistTopTracks, getArtistAlbums, getAlbums, getRelatedArtists } = spotify;
    const player = usePlayer();
    const palette = usePalette(artist && artist.images[0].url);

    // Retrieve Artist Data
    const retrieveArtistData = useCallback((artistId) => {
        getArtistById(artistId);
    }, [getArtistById]);

    // Get Artist
    useEffect(() => {
        if (idParams !== id) {
            setArtist(null);
            setId(idParams)
            retrieveArtistData(idParams)
        };
    }, [id, idParams, retrieveArtistData]);

    // Retrieve Other Data
    const retrieveOtherData = useCallback(() => {
        getArtistTopTracks(id, navigator.language.split('-')[1].toUpperCase());
        getArtistAlbums(id);
        getRelatedArtists(id)
    }, [id, getArtistTopTracks, getArtistAlbums, getRelatedArtists]);

    // Set Artist & Get Other Data
    useEffect(() => {
        if (artist !== spotify.artist) {
            setArtist(spotify.artist);
            retrieveOtherData();
        }
    }, [artist, spotify.artist, retrieveOtherData]);

    // Set Support Data
    useEffect(() => {
        if (spotify.artistTopTracks.length > 0 && topTracks.length === 0) setTopTracks(spotify.artistTopTracks);

        if (spotify.albums.length > 0 && popularAlbums.length === 0) {
            const albums = spotify.albums.sort((a, b) => {
                if (a.popularity < b.popularity) return 1;
                if (a.popularity > b.popularity) return -1;
                return 0;
            });

            setPopularAlbums(albums);
        }

        if (spotify.artistAlbums.length > 0 && (artistAlbums.length === 0 && artistSingles.length === 0)) {
            const albumIds = spotify.artistAlbums.reduce((output, current) => output.length > 0 ? `${output},${current.id}` : current.id, '');
            getAlbums(albumIds.split(','));

            const albums = [];
            const singles = [];
            spotify.artistAlbums.map(album => {
                if (album.album_type === 'single') singles.push(album);
                if (album.album_type === 'album') albums.push(album);

                return true;
            });

            setArtistAlbums(albums);
            setArtistSingles(singles)
        }

        if (spotify.artists.length > 0 && relatedArtists.length === 0) setRelatedArtists(spotify.artists)
    }, [spotify.artistTopTracks, topTracks, getAlbums, spotify.albums, popularAlbums, spotify.artistAlbums, artistAlbums, artistSingles, spotify.artists, relatedArtists]);

    // Set Background Color
    useEffect(() => {
        if (palette.data) {
            setBodyColor(palette.data.muted);
            setHeaderColor(palette.data.vibrant);
        }
    }, [palette, setBodyColor, setHeaderColor]);

    // Follow Handler
    async function followHandler() {
        if (!spotify.isArtistFollowed(libraryCtx.followedArtists, artist.id)) {
            libraryCtx.addFollowedArtists(artist)
            const success = await spotify.followArtist(artist.id);
            if (!success) libraryCtx.removeFollowedArtists(artist.id);
        }
        else {
            libraryCtx.removeFollowedArtists(artist.id);
            const success = await spotify.unfollowArtist(artist.id);
            if (!success) libraryCtx.addFollowedArtists(artist);
        }
    }

    // Play Artist Handler
    function playHandler() {
        if (currentlyPlaying && !currentlyPlaying.is_playing) player.playNonSong(artist.uri)
        else player.pause()
    }

    // Play Song Handler
    function playSongHandler(track, position = null) {
        if (currentlyPlaying && !currentlyPlaying.is_playing) {
            if (currentlyPlaying.item.id !== track.id) player.playNonSong(artist.uri, position);
            else player.playNonSong();
        } else player.pause();
    }

    // Play Album Handler
    function playAlbumHandler() {

    }

    // console.log('RENDERING ARTIST PAGE');
    console.log(artist);

    return (
        <React.Fragment>
            {/* Head */}
            {
                (artist) && (
                    <section className="relative h-80 w-full">
                        {/* Verified. Monthly listener >= 100.000 */}
                        <div className="absolute -top-20 bottom-0 inset-x-0 overflow-y-hidden"
                            style={{
                                backgroundImage: `url(${artist.images[0].url})`,
                                // backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="h-full bg-black bg-opacity-30 flex flex-col justify-end pl-8 pb-6">
                                <div className="text-white text-sm flex items-center gap-2">
                                    <CheckCircleIcon
                                        className="text-blue-600 bg-white rounded-full ring ring-inset ring-blue-500"
                                        style={{ width: 20, height: 20 }} />
                                    Verified Artist
                                </div>
                                <h2 className="text-7xl text-white font-bold">{artist.name}</h2>
                                <p className="text-white font-medium ">{artist.followers.total.toLocaleString()} followers</p>
                            </div>
                        </div>
                        {/* Non-verified. Monthly listener < 100.000 */}
                    </section>
                )
            }

            {/* Body */}
            {
                (artist) && (
                    <section
                        className="pb-6 px-4"
                        style={{ background: `linear-gradient(180deg, ${palette.data.vibrant} -10%, #181818 15%)` }}
                    >
                        {/* Player */}
                        <PageBodyPlayer
                            id={artist.id}
                            followOption={FollowOptions.FOLLOW_BUTTON}
                            isSaved={isArtistFollowed(libraryCtx.followedArtists, artist.id)}
                            onFollow={followHandler}
                            onPlay={playHandler}
                        >
                            <div className="w-48 absolute top-6 bg-292929 text-sm text-gray-300 font-medium p-1 rounded shadow-2xl tracking-tight transition ease duration-300 transform">
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Follow</p>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Go to artist radio</p>
                                <span className="px-2 py-1 cursor-pointer rounded flex justify-between items-center transition ease duration-200 hover:bg-white hover:bg-opacity-30">
                                    Share
                                    <PlayArrowIcon style={{ fontSize: 16 }} />
                                </span>
                                <p className="px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Open in Desktop App</p>
                            </div>
                        </PageBodyPlayer>

                        {/* Popular */}
                        {
                            (topTracks.length > 0 && currentlyPlaying) && (
                                <ArtistRow
                                    label="Popular"
                                    rowType={RowType.LIST}
                                    items={topTracks}
                                    currentlyPlaying={currentlyPlaying}
                                    seeAllText=" "
                                    onPlay={playSongHandler} />
                            )
                        }

                        {/* Popular Albums */}
                        {
                            (popularAlbums.length > 0) && (
                                <ArtistRow
                                    label="Popular Releases"
                                    className="mt-8"
                                    rowType={RowType.GRID}
                                    items={popularAlbums}
                                    seeAllText="Show Discography"
                                    onPlay={playAlbumHandler} />
                            )
                        }

                        {/* Albums */}
                        {
                            (artistAlbums.length > 0) && (
                                <ArtistRow
                                    label="Albums"
                                    className="mt-8"
                                    rowType={RowType.GRID}
                                    items={artistAlbums}
                                    seeAllText="Show Discography"
                                    onPlay={playAlbumHandler} />
                            )
                        }

                        {/* Singles and EPs */}
                        {
                            (artistSingles.length > 0) && (
                                <ArtistRow
                                    label="Singles and EPs"
                                    className="mt-8"
                                    rowType={RowType.GRID}
                                    items={artistSingles}
                                    seeAllText="Show Discography"
                                    onPlay={playAlbumHandler} />
                            )
                        }

                        {/* Related Artists */}
                        {
                            (relatedArtists.length > 0) && (
                                <ArtistRow
                                    label="Fans also like"
                                    className="mt-8"
                                    rowType={RowType.GRID}
                                    items={relatedArtists}
                                    seeAllText="See All"
                                    onPlay={playAlbumHandler} />
                            )
                        }

                        {/* About Artist */}
                        {
                            (artist !== null) && (
                                <AboutArtist
                                    className="mt-8 mb-4"
                                    name={artist.name}
                                    img={artist.images[0].url}
                                    followers={artist.followers.total.toLocaleString()} />
                            )
                        }
                    </section>
                )
            }
        </React.Fragment>
    )
}

export default Artist;