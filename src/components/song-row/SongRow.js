import React, { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaylistItem from './playlist-item/PlaylistItem';
import AlbumItem from './album-item/AlbumItem';
import TrackItem from './track-item/TrackItem';
import SongItem from './song-item/SongItem';

function SongRow(props) {
    const { type, hideHeader, songList, currentlyPlayingSongId, isPlaying, onPlaySong: playSongHandler } = props;

    const [hoverId, setHoverId] = useState(null);
    const [showMore, setShowMore] = useState(false);

    var dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className={`${props.className}`}>
            {
                !hideHeader && (
                    <div className="flex gap-4 text-sm text-gray-400 w-full border-b border-gray-500 pb-2 px-4 uppercase">
                        <p className="w-8">#</p>
                        <div className="w-full grid grid-cols-4 gap-4">
                            <p className={type === 'album' ? 'col-span-3' : ''}>Title</p>
                            {(type === 'playlist') && <p>Album</p>}
                            {(type === 'playlist') && <p>Date Added</p>}
                            <p className="text-center"><AccessTimeIcon style={{ fontSize: 16 }} /></p>
                        </div>
                    </div>
                )
            }
            <div className="mt-4">
                {
                    songList.map((item, index) => {
                        switch (type) {
                            case 'playlist':
                                return (
                                    <PlaylistItem
                                        key={index}
                                        item={item}
                                        index={index}
                                        hoverId={hoverId}
                                        dateOptions={dateOptions}
                                        isPlaying={isPlaying}
                                        currentlyPlayingSongId={currentlyPlayingSongId}
                                        setHoverId={setHoverId}
                                        onPlaySong={playSongHandler} />
                                )
                            case 'album':
                                return (
                                    <AlbumItem
                                        key={index}
                                        item={item}
                                        index={index}
                                        hoverId={hoverId}
                                        dateOptions={dateOptions}
                                        isPlaying={isPlaying}
                                        currentlyPlayingSongId={currentlyPlayingSongId}
                                        setHoverId={setHoverId}
                                        onPlaySong={playSongHandler} />
                                )

                            case 'track':
                                if (!props.seeMoreText || (showMore || index < props.showTheFirst)) {
                                    return (
                                        <TrackItem
                                            key={index}
                                            item={item}
                                            index={index}
                                            hoverId={hoverId}
                                            isPlaying={isPlaying}
                                            currentlyPlayingSongId={currentlyPlayingSongId}
                                            setHoverId={setHoverId}
                                            onPlaySong={playSongHandler} />
                                    )
                                } else {
                                    return null;
                                }

                                case 'song':
                                    if (index < props.showTheFirst) {
                                        return (
                                            <SongItem
                                                key={index}
                                                item={item}
                                                index={index}
                                                hoverId={hoverId}
                                                isPlaying={isPlaying}
                                                currentlyPlayingSongId={currentlyPlayingSongId}
                                                setHoverId={setHoverId}
                                                onPlaySong={playSongHandler} />
                                        )
                                    } else {
                                        return null;
                                    }    

                            default:
                                return null
                        }
                    })
                }
            </div>
            {
                (props.seeMoreText) &&
                <button className="mt-4 text-sm font-bold text-gray-400 hover:text-white uppercase transition ease duration-300" onClick={() => setShowMore(!showMore)}>
                    {showMore ? props.seeMoreText.split('/')[1] : props.seeMoreText.split('/')[0]}
                </button>
            }
        </div>
    )
}

export default SongRow;