import { Link } from "react-router-dom";

function PlayerListHeading(props) {
    return (
        <div className="flex items-end justify-between mb-2">
            <h2 className={`text-white text-2xl font-bold ${props.className}`}>{props.children}</h2>
            {
                props.showSeeAll && (
                    <Link className="text-sm text-gray-400 font-bold uppercase" to="#">{props.seeAllText ? props.seeAllText : 'SEE ALL'}</Link>
                )
            }
        </div>
    )
}

export default PlayerListHeading;