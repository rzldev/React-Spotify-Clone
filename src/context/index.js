import AuthContextProvider from "./auth-context"
import LibraryContextProvider from "./library-context"
import PlaybackContextProvider from "./playback-context"
import PlayerContextProvider from "./player-context"
import UIContextProvider from "./ui-context"

function Context(props) {
    return (
        <AuthContextProvider>
            <PlayerContextProvider>
                <PlaybackContextProvider>
                    <LibraryContextProvider>
                        <UIContextProvider>
                            {props.children}
                        </UIContextProvider>
                    </LibraryContextProvider>
                </PlaybackContextProvider>
            </PlayerContextProvider>
        </AuthContextProvider>
    )
}

export default Context