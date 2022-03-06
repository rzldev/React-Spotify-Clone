import React, { useCallback, useContext, useEffect } from "react";
import { LibraryContext } from "../../context/library-context";
import NewRelease from "../../components/new-release/NewRelease";
import RecentlyPlayed from "../../components/recently-played/RecentlyPlayed";
import SuggestedArtists from "../../components/suggested-artists/SuggestedArtists";
import { UIContext } from "../../context/ui-context";
import { useSpotify } from "../../hooks/use-new-spotify";

function Home() {
    const { 
        recentlyPlayed, setRecentlyPlayed, newReleases, setNewReleases, suggestedArtists, setSuggestedArtists
    } = useContext(LibraryContext);
    const { setBodyColor, setHeaderColor } = useContext(UIContext);

    const spotify = useSpotify();
    const { getRecentlyPlayed, getSuggestedArtists, getNewReleases, getTopTracks, getTopArtists } = spotify;

    // Retrieve Home Data
    const retrieveHomeData = useCallback(() => {
        getRecentlyPlayed();
        getSuggestedArtists();
        getNewReleases();
        getTopTracks();
        getTopArtists();
    }, [getRecentlyPlayed, getSuggestedArtists, getNewReleases, getTopTracks, getTopArtists]);

    // Fetch Home Data
    useEffect(() => {
        retrieveHomeData();
        setBodyColor(null);
        setHeaderColor(null);
    }, [retrieveHomeData, setBodyColor, setHeaderColor]);

    // Set Home Data
    useEffect(() => {
        if (recentlyPlayed.length === 0 && spotify.recentlyPlayed.length > 0) setRecentlyPlayed(spotify.recentlyPlayed);

        if (suggestedArtists.length === 0 && spotify.suggestedArtists.length > 0) setSuggestedArtists(spotify.suggestedArtists);
        
        if (newReleases.length === 0 && spotify.newReleases.length > 0) setNewReleases(spotify.newReleases);
    }, [recentlyPlayed, setRecentlyPlayed, suggestedArtists, setSuggestedArtists, newReleases, setNewReleases, spotify.recentlyPlayed, spotify.suggestedArtists, spotify.newReleases])

    console.log('RENDERING HOME PAGE');

    return (
        <div className="px-4 py-3">
            {recentlyPlayed.length > 0 && (<RecentlyPlayed className="mb-8" />)}
            {newReleases.length > 0 && (<NewRelease className="mb-8" />)}
            {suggestedArtists.length > 0 && (<SuggestedArtists className="mb-4" />)}
        </div>
    )
}

export default Home;