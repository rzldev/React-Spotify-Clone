import React, { useContext, useEffect } from "react";
import BrowseAll from "../../components/browse-all/BrowseAll";
import { UIContext } from "../../context/ui-context";
import { LibraryContext } from "../../context/library-context";
import { useSpotify, useSpotifySearch } from "../../hooks/use-new-spotify";
import { useHistory } from "react-router-dom";
import SearchRow, { RowType } from "../../components/search-row/SearchRow";
import { PlayerContext } from "../../context/player-context";

function Search() {
    const history = useHistory();
    const pathname = history.location.pathname;

    const { numItemList, setBodyColor, setHeaderColor } = useContext(UIContext);
    const { categories, setCategories } = useContext(LibraryContext);
    const { currentlyPlaying } = useContext(PlayerContext);

    const spotify = useSpotify();
    const { getCategories } = spotify;
    const search = useSpotifySearch();
    const { searchByParam } = search;

    // Categories
    useEffect(() => {
        getCategories();
        setBodyColor(null);
        setHeaderColor(null);
    }, [getCategories, setBodyColor, setHeaderColor]);

    // // Get Top Genres
    // useEffect(() => {
    //     if (topArtists.length > 0 && topGenres.length === 0) {
    //         // Genre = { name: ..., total: ...};
    //         let genres = [];
    //         topArtists.forEach(artist => {
    //             artist.genres.forEach(genre => {
    //                 const genreFound = genres.find(item => item.name === genre);

    //                 if (!genreFound) {
    //                     genres.push({ name: genre, count: 1 });
    //                 } else {
    //                     genreFound.count = genreFound.count + 1;
    //                     genres.map(item => (item.name === genre) && genreFound);
    //                 }
    //             });
    //         }, null)

    //         const sortedGenres = genres.sort((a, b) => {
    //             const countGenreA = a.count;
    //             const countGenreB = b.count;

    //             if (countGenreA > countGenreB) return -1;
    //             if (countGenreA < countGenreB) return 1;
    //             return 0;
    //         });

    //         setTopGenres(sortedGenres);
    //     }
    // }, [topArtists, topGenres]);

    // Set Data
    useEffect(() => {
        if (spotify.categories.length > 0 && categories.length === 0) setCategories(spotify.categories);
    }, [spotify.categories, categories, setCategories]);

    // Search Item
    useEffect(() => {
        if (pathname.split('/').length > 2 && pathname.split('/')[2].length > 0) {
            const param = pathname.split('/')[2];
            searchByParam(param);
        }
    }, [pathname, searchByParam]);

    // To Check Similarities
    const similarity = (itemChars) => {
        const param = pathname.split('/')[2];

        let equivalency = 0;
        const minLength = (param.length > itemChars.length) ? itemChars.length : param.length;    
        const maxLength = (param.length < itemChars.length) ? itemChars.length : param.length;

        for(var i = 0; i < minLength; i++) {
            if(param[i] === itemChars[i]) {
                equivalency++;
            }
        }

        var weight = equivalency / maxLength;
        return (weight * 100);
    }

    console.log('RENDERING SEARCH PAGE');
    // console.log(search.artists);

    return (
        <div className="px-4 py-3">
            {
                pathname.split('/').length > 2 && pathname.split('/')[2].length > 0
                    ? (
                        <div>
                            {/* Songs */}
                            {
                                search.tracks.length > 0 && (
                                    <SearchRow
                                        className="mb-8"
                                        label="Songs"
                                        rowType={RowType.SONGS}
                                        items={search.tracks}
                                        currentlyPlaying={currentlyPlaying}
                                        onPlay={() => { }} />
                                )
                            }

                            {/* Artists */}
                            {
                                search.artists.length > 0 && (
                                    <SearchRow
                                        className="mb-8"
                                        label="Artists"
                                        rowType={RowType.GRID}
                                        items={search.artists}
                                        onPlay={() => { }} />
                                )
                            }

                            {/* Albums */}
                            {
                                search.albums.length > 0 && (
                                    <SearchRow
                                        className="mb-8"
                                        label="Albums"
                                        rowType={RowType.GRID}
                                        items={search.albums}
                                        onPlay={() => { }} />
                                )
                            }

                            {/* Playlists */}
                            {
                                search.playlists.length > 0 && (
                                    <SearchRow
                                        className="mb-8"
                                        label="Playlists"
                                        rowType={RowType.GRID}
                                        items={search.playlists}
                                        onPlay={() => { }} />
                                )
                            }
                        </div>
                    ) : (
                        <BrowseAll numItemList={numItemList} categories={categories} />
                    )
            }

        </div>
    )
}

export default Search;