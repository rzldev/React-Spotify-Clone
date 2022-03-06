import CategoryCard from "../player-card/category-card/CategoryCard";
import PlayerListHeading from "../player-list-heading/PLayerListHeading";

function BrowseAll(props) {
    return (
        <div className={props.className}>
            <PlayerListHeading>Browse all</PlayerListHeading>
            <div className={`grid gap-5 grid-cols-${props.numItemList}`}>
                {
                    props.categories.map(category => (
                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            image={category.icons[0].url} />
                    ))
                }
            </div>
        </div>
    )
}

export default BrowseAll;