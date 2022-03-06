import { useContext } from "react";
import { LibraryContext } from "../../context/library-context";
import { UIContext } from "../../context/ui-context";
import PlayerCard from "../player-card/PlayerCard";
import PlayerListHeading from "../player-list-heading/PLayerListHeading";

function NewRelease(props) {
    const { newReleases } = useContext(LibraryContext);
    const { numItemList } = useContext(UIContext);
    
    return (
        <div className={props.className}>
            <PlayerListHeading showSeeAll={newReleases.length > numItemList}>
                New Releases
            </PlayerListHeading>

            <div className={`flex gap-4 grid grid-cols-${numItemList} overflow-hidden`}>
                {
                    newReleases.map((item, index) => 
                        index < numItemList
                            ? (
                                <PlayerCard
                                    key={item.id}
                                    type={item.type}
                                    item={item} />
                            )
                            : null
                    )
                }
            </div>
        </div>
    )
}

export default NewRelease;