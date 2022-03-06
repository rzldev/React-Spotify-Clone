import { useContext } from "react";
import { UIContext } from "../../context/ui-context";
import PlayerCard from "../player-card/PlayerCard";
import PlayerListHeading from "../player-list-heading/PLayerListHeading";
import SongRow from "../song-row/SongRow";

export const RowType = {
    LIST: 1,
    GRID: 2,
}

function ArtistRow(props) {
    const uiCtx = useContext(UIContext);

    return (
        <div className={props.className}>
            <PlayerListHeading showSeeAll={props.items.length > uiCtx.numItemList} seeAllText={props.seeAllText}>{props.label}</PlayerListHeading>

            {/* List */}
            {
                (props.rowType === RowType.LIST) && (
                    <SongRow
                        type="track"
                        hideHeader
                        songList={props.items}
                        isPlaying={props.currentlyPlaying.is_playing}
                        currentlyPlayingSongId={props.currentlyPlaying.item.id}
                        onPlaySong={props.onPlay}
                        showTheFirst={5}
                        seeMoreText="See More/Show Less" />
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

export default ArtistRow;