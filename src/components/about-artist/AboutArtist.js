import PlayerListHeading from "../player-list-heading/PLayerListHeading";

function AboutArtist(props) {
    return (
        <div className={props.className}>
            <PlayerListHeading>About</PlayerListHeading>

            <div className="bg-white bg-opacity-10 rounded-xl p-10 flex">
                <div className="flex-shrink flex flex-col items-center">
                    <img className="w-56 h-56 rounded-full" src={props.img} alt={props.name} />
                    <p className="text-white font-bold mt-8">{props.followers} followers</p>
                </div>
            </div>
        </div>
    )
}

export default AboutArtist;