import React, { Fragment, useContext, useState } from "react";
import { PlayerContext } from "../../context/player-context";
import { Transition } from "@headlessui/react";
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CircleIcon from '@mui/icons-material/Circle';

export const FollowOptions = {
    FOLLOW_BUTTON: 'FOLLOW_BUTTON',
    FAVORITE_BUTTON: 'FAVORITE_BUTTON',
}

function PageBodyPlayer(props) {
    const { id, isSaved, followOption, children, onFollow: followHandler, onPlay: playHandler } = props;

    const { currentlyPlaying } = useContext(PlayerContext);

    const [showOptions, setShowOptions] = useState(false);

    let actionButton = null;
    switch (followOption) {
        case FollowOptions.FAVORITE_BUTTON:
            actionButton = (
                <span
                    className={`${isSaved ? 'text-spotify' : 'text-gray-500 hover:text-white'} cursor-pointer transition duration-200 ease-in-out transform hover:scale-110`}
                    onClick={followHandler}
                >
                    {
                        isSaved
                            ? <FavoriteIcon style={{ fontSize: 32 }} />
                            : <FavoriteBorderIcon style={{ fontSize: 32 }} />
                    }
                </span>
            )
            break;

        case FollowOptions.FOLLOW_BUTTON:
            actionButton = (
                <button
                    className="text-sm font-medium uppercase border rounded px-4 py-2 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 text-gray-300 hover:text-white hover:font-bold border-gray-500 hover:border-white"
                    onClick={followHandler}
                >
                    {
                        (isSaved) ? 'Following' : 'Follow'
                    }
                </button>
            )
            break;

        default:
            actionButton = null;
            break;
    }

    return (
        <React.Fragment>
            {/* Player */}
            <div className="flex items-center gap-6 py-6">
                <span className="text-spotify cursor-pointer transition ease duration-200 transform hover:scale-110" onClick={playHandler}>
                    {
                        (currentlyPlaying && currentlyPlaying.is_playing && currentlyPlaying.context && currentlyPlaying.context.uri.split(':')[2] === id)
                            ? <PauseCircleFilledRoundedIcon style={{ fontSize: 64 }} />
                            : <PlayCircleRoundedIcon style={{ fontSize: 64 }} />
                    }
                </span>
                {
                    (actionButton !== null) && actionButton
                }
                <div className="relative">
                    <button
                        className="text-gray-400 flex gap-1 cursor-pointer transition ease duration-200 transform hover:text-white hover:scale-110"
                        onClick={() => setShowOptions(!showOptions)}
                        onBlur={() => setShowOptions(false)}
                    >
                        <CircleIcon style={{ fontSize: 6 }} />
                        <CircleIcon style={{ fontSize: 6 }} />
                        <CircleIcon style={{ fontSize: 6 }} />
                    </button>
                    <Transition
                        as={Fragment}
                        show={showOptions}
                        enterFrom="opacity-0 -translate-y-8"
                        enterTo="opacity-100 translate-y-0"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-8"
                    >
                        {children}
                    </Transition>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PageBodyPlayer;