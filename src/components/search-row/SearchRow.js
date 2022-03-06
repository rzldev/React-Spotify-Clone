import { useContext } from "react";
import { UIContext } from "../../context/ui-context";
import PlayerCard from "../player-card/PlayerCard";
import SongRow from "../song-row/SongRow";
import PlayerListHeading from "../player-list-heading/PLayerListHeading";

export const RowType = {
    TOP: 1,
    SONGS: 2,
    GRID: 3,
}

function SearchRow(props) {
    const uiCtx = useContext(UIContext);

    return (
        <div className={props.className}>
            <PlayerListHeading showSeeAll={props.items.length > uiCtx.numItemList} seeAllText="See All">{props.label}</PlayerListHeading>

            {/* Songs */}
            {
                (props.rowType === RowType.SONGS) && (
                    <SongRow
                        type="song"
                        hideHeader
                        songList={props.items}
                        isPlaying={props.currentlyPlaying.is_playing}
                        currentlyPlayingSongId={props.currentlyPlaying.item.id}
                        onPlaySong={props.onPlay}
                        showTheFirst={4} />
                )
            }

            {/* Grid */}
            {
                (props.rowType === RowType.GRID) && (
                    <div className={`flex gap-4 grid grid-cols-${uiCtx.numItemList} overflow-hidden mt-4`}>
                        {
                            props.items.map((item, index) => (
                                index < uiCtx.numItemList
                                    ? (
                                        <PlayerCard
                                            key={item.id}
                                            type={item.type}
                                            item={item} />
                                    )
                                    : null
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default SearchRow;