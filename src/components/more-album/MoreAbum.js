import { useContext } from "react";
import { UIContext } from "../../context/ui-context";
import PlayerCard from "../player-card/PlayerCard";

function MoreAlbum(props) {
    const { artist, albums } = props;

    const { numItemList } = useContext(UIContext);

    return (
        <div className={props.className}>
            <h2 className="text-xl text-white font-bold">More by {artist}</h2>

            <div className={`mt-4 grid grid-cols-${numItemList} gap-4 overflow-hidden`}>
                {
                    albums.map((album, index) => (
                        index < numItemList
                            ? (<PlayerCard key={album.id} type={album.type} item={album} />)
                            : null
                    ))
                }
            </div>
        </div>
    )
}

export default MoreAlbum;