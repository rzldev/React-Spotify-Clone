import React, { Fragment } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'; import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

function PlaylistCard(props) {
    return (
        <div 
            className="relative px-4 pt-4 rounded-lg transition ease duration-200 bg-gray-500 bg-opacity-5 hover:bg-opacity-20 cursor-pointer"
            onMouseOver={props.onMouseOver}
            onMouseLeave={props.onMouseLeave}
        >
            <Link to={props.url}>
                <img src={props.image} alt={props.name} className="mb-4" />
                <label className="text-white font-bold line-clamp-1">{props.name}</label>
                <p className="text-sm text-gray-300 truncate h-10">{props.description.length > 0 ? props.description : props.name}</p>
            </Link>
            <Transition
                as={Fragment}
                show={props.onHover}
                enter="duration-300"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
            >
                <span
                    className="z-10 absolute bottom-24 right-8 transform scale-125 bg-spotify-green rounded-full p-2 flex items-center justify-center transition ease-in-out"
                    onClick={() => props.onPlay(props.isPlaying, props.uri)}
                >
                    {
                        props.isPlaying
                            ? <PauseRoundedIcon className="text-white" />
                            : <PlayArrowIcon className="text-white" />
                    }
                </span>
            </Transition>
        </div>
    )
}

export default PlaylistCard;