import React, { useContext, useEffect } from "react";
import { LibraryContext } from "../../context/library-context";
import Playlists from "../../components/playlists/Playlists";
import { UIContext } from "../../context/ui-context";

function Library() {
    const { playlists, savedTracks } = useContext(LibraryContext);
    const { setBodyColor, setHeaderColor } = useContext(UIContext);

    useEffect(() => {
        setBodyColor(null);
        setHeaderColor(null);
    }, [setBodyColor, setHeaderColor]);

    return (
        <React.Fragment>
            {playlists.length > 0 && (<Playlists playlists={playlists} savedTracks={savedTracks} />)}
        </React.Fragment>
    )
}

export default Library;