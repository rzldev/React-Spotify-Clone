import { Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react"
import { UIContext } from "../../context/ui-context";
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import PlayerCard from "../player-card/PlayerCard";
import PlayerListHeading from "../player-list-heading/PLayerListHeading"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function Playlists(props) {
    const { playlists, savedTracks } = props;
    const { numItemList } = useContext(UIContext);

    const [hoverIndex, setHoverIndex] = useState(null)

    return (
        <div className={`${props.className}`}>
            <PlayerListHeading>Playlists</PlayerListHeading>

            <div className={`grid grid-cols-${numItemList} gap-4 mb-8`}>
                <div
                    className="p-4 rounded-lg cursor-pointer relative col-span-1 sm:col-span-2 min-h-40 bg-gradient-to-br from-indigo-700 via-indigo-500 to-purple-400"
                    onMouseOver={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <div className="h-full flex flex-col justify-end text-white">
                        <div className="flex flex-wrap mb-2">
                            {
                                savedTracks.map((item, index) => index < 4 && (
                                    <div key={item.id} className="flex items-center">
                                        <label className="text-sm font-medium">{item.artists.reduce((accum, artist) => accum.length < 1 ? accum + artist.name : accum + `, ${artist.name}`, '')}</label>
                                        <p className="text-sm ml-2 opacity-70">{item.name}</p>
                                        {index < 3 && <CircleRoundedIcon className="text-white opacity-70 transform scale-25" />}
                                    </div>
                                ))
                            }
                        </div>
                        <h2 className="text-4xl font-bold">Liked songs</h2>
                        <p className="font-medium">{savedTracks.length} liked songs</p>
                    </div>

                    <Transition
                        as={Fragment}
                        show={hoverIndex === 1}
                        enter="duration-300"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="duration-300"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-2"
                    >
                        <span className="absolute bottom-4 right-4 transform bg-spotify-green rounded-full p-2 flex items-center justify-center transition ease-in-out">
                            <PlayArrowIcon className="text-white" />
                        </span>
                    </Transition>
                </div>

                {
                    playlists.map(item => (
                        <PlayerCard
                            key={item.id}
                            type={item.type}
                            item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default Playlists