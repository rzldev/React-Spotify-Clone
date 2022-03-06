import React, { useContext, useState } from "react";
import PlaylistCard from "./playlist-card/PlaylistCard";
import { PlayerContext } from "../../context/player-context";
import ArtistCard from "./artist-card/ArtistCard";
import { usePlayer } from "../../hooks/use-new-spotify";

const PlayerCard = React.memo(props => {
    const { item, type } = props;

    const [itemUri, setItemUri] = useState(null);

    const { currentlyPlaying } = useContext(PlayerContext);
    
    const player = usePlayer();

    async function startPlayingHandler(isPlaying, uri) {
        if (!isPlaying) await player.playNonSong(uri);
        else await player.pause();
    }

    let card;
    switch (type) {
        case 'playlist':
            card = (
                <PlaylistCard
                    image={item.images[0].url}
                    name={item.name}
                    description={item.description}
                    onHover={item.uri === itemUri}
                    onMouseOver={() => setItemUri(item.uri)}
                    onMouseLeave={() => setItemUri(null)}
                    uri={item.uri}
                    isPlaying={currentlyPlaying && currentlyPlaying.is_playing && currentlyPlaying.context && item.id === currentlyPlaying.context.uri.split(':')[2]}
                    url={`/${item.uri.split(':')[1]}/${item.uri.split(':')[2]}`}
                    onPlay={startPlayingHandler} />
            );
            break;

        case 'album':
            card = (
                <PlaylistCard
                    image={item.images[0].url}
                    name={item.name}
                    description={item.artists.reduce((output, artist) => output.length > 0 ? `${output}, ${artist}` : artist, '')}
                    onHover={item.uri === itemUri}
                    onMouseOver={() => setItemUri(item.uri)}
                    onMouseLeave={() => setItemUri(null)}
                    uri={item.uri}
                    isPlaying={currentlyPlaying && currentlyPlaying.is_playing && currentlyPlaying.context && item.id === currentlyPlaying.context.uri.split(':')[2]}
                    url={`/${item.uri.split(':')[1]}/${item.uri.split(':')[2]}`} 
                    onPlay={startPlayingHandler} />
            );
            break;

        case 'artist':
            card = (
                <ArtistCard
                    image={item.images[0].url}
                    name={item.name}
                    description="Artist"
                    onHover={item.uri === itemUri}
                    onMouseOver={() => setItemUri(item.uri)}
                    onMouseLeave={() => setItemUri(null)}
                    uri={item.uri}
                    isPlaying={currentlyPlaying && currentlyPlaying.is_playing && currentlyPlaying.context && item.id === currentlyPlaying.context.uri.split(':')[2]}
                    url={`/${item.uri.split(':')[1]}/${item.uri.split(':')[2]}`}
                    /* onPlay={startPlayingHandler} */ />
            )
            break;

        default:
            break;
    }

    return card
});

export default PlayerCard;