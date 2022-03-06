import { Transition } from '@headlessui/react';
import { useHistory } from "react-router-dom";
import { Fragment, useContext, useState } from 'react';
import { usePlayer } from '../../hooks/use-new-spotify';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { PlaybackContext } from '../../context/playback-context';

function RecommendedSongs(props) {
    const { recommendations, isPlaying, currentlyPlayingSongId, isTrackExist, onAddIntoPlaylist, onRefresh } = props;

    const [hoverId, setHoverId] = useState(null);

    const { setPlayingState } = useContext(PlaybackContext);

    const player = usePlayer();
    const history = useHistory()

    async function playHandler(track, position) {
        setPlayingState(!isPlaying);

        if (currentlyPlayingSongId === track.id) {
            if (isPlaying) await player.pause();
            else await player.playSong();
        }
        else {
            const tracks = recommendations.reduce((output, item) => [...output, item.uri], [])
            await player.playSong(tracks, position);
        }
    }

    return (
        <div className={props.className}>
            {/* Header */}

            <div className="flex items-center justify-between mx-2">
                <div>
                    <h3 className="text-xl text-white font-bold">Recommended</h3>
                    <p className="text-sm text-gray-300 font-medium">Based on what's in this playlist</p>
                </div>

                <button className="mr-2 px-6 py-1.5 uppercase text-white text-sm font-medium border border-gray-500 rounded-full transition duration-200 ease transform hover:scale-105 hover:border-white hover:border-2 hover:font-bold">Find more</button>
            </div>

            {/* List of recommendations */}
            <div className="w-full mt-8">
                {
                    recommendations.map((item, index) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-8 gap-4 items-center justify-between px-4 py-2 text-gray-300 transition duration-100 ease hover:bg-white hover:bg-opacity-20"
                            onMouseOver={() => setHoverId(item.id)}
                            onMouseLeave={() => setHoverId(null)}
                        >
                            <div className="col-span-4 flex gap-2 relative">
                                <img
                                    className="w-10 h-10"
                                    src={item.album.images[0].url}
                                    alt={item.album.name} />
                                <Transition
                                    as={Fragment}
                                    show={hoverId === item.id}
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div
                                        className="absolute top-0 left-0 h-10 w-10 flex items-center justify-center bg-gray-500 bg-opacity-40 text-white transition duration-200 ease"
                                        onClick={() => playHandler(item, index)}
                                    >
                                        {
                                            (isPlaying && item.id === currentlyPlayingSongId)
                                                ? <PauseIcon className="cursor-pointer" style={{ fontSize: 20 }} />
                                                : <PlayArrowIcon className="cursor-pointer" style={{ fontSize: 20 }} />
                                        }
                                    </div>
                                </Transition>
                                <div className="grid truncate">
                                    <label className="text-md text-white font-medium">{item.name}</label>
                                    <p 
                                        className="text-sm cursor-pointer transition duration-200 ease hover:text-white hover:underline"
                                        onClick={() => history.push(`/${item.artists[0].uri.split(':')[1]}/${item.artists[0].uri.split(':')[2]}`)}
                                    >
                                        {item.artists.reduce((output, artist) => output.length > 0 ? `${output}, ${artist.name}` : artist.name, '')}
                                    </p>
                                </div>
                            </div>

                            <div className="col-span-3 truncate">
                                <label 
                                    className="cursor-pointer transition duration-200 ease hover:text-white hover:underline"
                                    onClick={() => history.push(`/${item.album.uri.split(':')[1]}/${item.album.uri.split(':')[2]}`)}
                                >
                                    {item.album.name}
                                    </label>
                            </div>

                            <div>
                                <button 
                                    className="w-full text-sm text-gray-300 font-medium border border-gray-500 rounded-full py-1.5 transition duration-200 ease hover:border-white hover:text-white"
                                    onClick={() => onAddIntoPlaylist(item.uri)}
                                >
                                    { !isTrackExist(item.uri) ? 'ADD' : 'REMOVE' }
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="flex justify-end mx-2 mt-6">
                <button
                    className="mr-2 px-6 py-1.5 uppercase text-white text-sm font-medium border border-gray-500 rounded-full transition duration-200 ease transform hover:scale-105 hover:border-white hover:border-2 hover:font-bold"
                    onClick={onRefresh}
                >
                    Refresh
                </button>
            </div>
        </div>
    )
}

export default RecommendedSongs;