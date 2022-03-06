import { useContext } from "react";
import PlayerListHeading from "../player-list-heading/PLayerListHeading";
import PlayerCard from "../player-card/PlayerCard";
import { UIContext } from "../../context/ui-context";
import { LibraryContext } from "../../context/library-context";

function RecentlyPlayed(props) {
    const { recentlyPlayed } = useContext(LibraryContext);
    const { numItemList } = useContext(UIContext);

    return (
        <div className={props.className}>
            <PlayerListHeading showSeeAll={recentlyPlayed.length > numItemList}>
                Recently Played
            </PlayerListHeading>

            <div className={`flex gap-4 grid grid-cols-${numItemList} overflow-hidden`}>
                {
                    recentlyPlayed.map((item, index) => (
                        index < numItemList
                            ? (
                                <PlayerCard
                                    key={index}
                                    type={item.type}
                                    item={item} />
                            )
                            : null
                    ))
                }
            </div>
        </div>
    )
}

export default RecentlyPlayed;