import { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Transition } from '@headlessui/react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useSpotify } from "../../../hooks/use-new-spotify";
import { LibraryContext } from "../../../context/library-context";

function AlbumItem(props) {
    const { item, index, hoverId, setHoverId, isPlaying, currentlyPlayingSongId, onPlaySong } = props;

    const [showOptions, setShowOptions] = useState(false);

    const libraryCtx = useContext(LibraryContext);

    const { isTrackSaved, addTrackToSavedTracks, removeTrackFromSavedTracks } = useSpotify();

    async function likeSongHandler(track) {
        if (!isTrackSaved(libraryCtx.savedTracks, track.id)) {
            libraryCtx.addSavedTrack(track);
            const success = await addTrackToSavedTracks(track.id);
            if (!success) libraryCtx.removeSavedTrack(track.id);
        }
        else {
            libraryCtx.removeSavedTrack(track.id);
            const success = await removeTrackFromSavedTracks(track.id);
            if (!success) libraryCtx.addSavedTrack(track);
        }
    }

    return (
        <div
            className="flex items-center gap-4 px-4 py-2 rounded-lg text-sm text-gray-400 transition ease duration-100 hover:bg-white hover:bg-opacity-20"
            onMouseOver={() => !showOptions && setHoverId(item.id)}
            onMouseLeave={() => !showOptions && setHoverId(null)}
        >
            <span className="w-8 cursor-pointer" onClick={() => onPlaySong(item, index)}>
                {
                    (isPlaying && currentlyPlayingSongId === item.id)
                        ? <PauseIcon style={{ fontSize: 16 }} />
                        : (hoverId === item.id)
                            ? <PlayArrowIcon style={{ fontSize: 16 }} />
                            : index + 1
                }
            </span>
            <div className="w-full grid grid-cols-4 gap-4 items-center">
                <div className="col-span-3 grid">
                    <label className="text-md text-white font-medium truncate">{item.name}</label>
                    <span className="flex line-clamp-1">
                            {
                                item.artists.map((artist, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {(index > 0) && (', ')}
                                            <Link
                                                key={artist.id}
                                                className="text-sm cursor-pointer transition duration-200 ease hover:text-white hover:underline"
                                                to={`/${item.artists[0].uri.split(':')[1]}/${item.artists[0].uri.split(':')[2]}`}
                                            >
                                                {artist.name}
                                            </Link>
                                        </Fragment>
                                    )
                                })
                            }
                        </span >
                </div>

                <div className="relative flex items-center justify-center">
                    {
                        (hoverId === item.id) && (
                            <span className={`absolute top-0 left-4 cursor-pointer ${isTrackSaved(libraryCtx.savedTracks, item.id) && 'text-spotify'}`} onClick={() => likeSongHandler(item)}>
                                {isTrackSaved(libraryCtx.savedTracks, item.id) ? <FavoriteIcon style={{ fontSize: 16 }} /> : <FavoriteBorderIcon style={{ fontSize: 16 }} />}
                            </span>
                        )
                    }
                    <p>{`${new Date(item.duration_ms).getMinutes()}:${(new Date(item.duration_ms).getSeconds() < 10) ? '0' : ''}${new Date(item.duration_ms).getSeconds()}`}</p>
                    {
                        (hoverId === item.id) && (
                            <div className="absolute right-4">
                                <div className="relative">
                                    <button onClick={() => setShowOptions(!showOptions)} onBlur={() => setShowOptions(false)}>
                                        <MoreHoriz style={{ fontSize: 24 }} />
                                    </button>

                                    <Transition
                                        as={Fragment}
                                        show={showOptions}
                                        enterFrom="opacity-0 -translate-y-8"
                                        enterTo="opacity-100 translate-y-0"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 -translate-y-8"
                                    >
                                        <div className="w-48 flex flex-col items-start justify-center absolute top-6 right-0 bg-292929 bg-opacity-100 text-sm text-gray-300 font-medium p-1 rounded shadow-2xl tracking-tight transition ease duration-300 transform z-10">
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Add to queue</button>
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Go to song radio</button>
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Go to artist</button>
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Go to album</button>
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Show credits</button>
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Save to your liked song</button>
                                            <span className="w-full text-left px-2 py-1 cursor-pointer rounded flex justify-between items-center transition ease duration-200 hover:bg-white hover:bg-opacity-30">
                                                Add to playlist
                                                <PlayArrowIcon style={{ fontSize: 16 }} />
                                            </span>
                                            <span className="w-full text-left px-2 py-1 cursor-pointer rounded flex justify-between items-center transition ease duration-200 hover:bg-white hover:bg-opacity-30">
                                                Share
                                                <PlayArrowIcon style={{ fontSize: 16 }} />
                                            </span>
                                            <button className="w-full text-left px-2 py-1 cursor-pointer rounded transition ease duration-200 hover:bg-white hover:bg-opacity-30">Open in Desktop App</button>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AlbumItem;