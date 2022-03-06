import React, { useContext, useEffect, useState } from "react";
import { LibraryContext } from "../../context/library-context";
import { PlayerContext } from "../../context/player-context";
import { PlaybackContext } from "../../context/playback-context";
import { REPEAT_STATES, usePlayer, useSpotify } from "../../hooks/use-new-spotify";
import ProgressBar from "../progress-bar/ProgressBar";
import DevicePopup from "../device-popup/DevicePopup";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WebAssetRoundedIcon from '@mui/icons-material/WebAssetRounded';
import WebAssetOffRoundedIcon from '@mui/icons-material/WebAssetOffRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import DevicesIcon from '@mui/icons-material/Devices';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import RepeatOneRoundedIcon from '@mui/icons-material/RepeatOneRounded';
import AnimatedIcon from "../ui/animated-icon/AnimatedIcon";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import { AuthContext } from "../../context/auth-context";
import { useHistory } from "react-router-dom";

const HomeFooter = React.memo((props) => {
    const libraryCtx = useContext(LibraryContext);
    const { token, clearAuth } = useContext(AuthContext);
    const { currentlyPlaying, setCurrentlyPlaying, deviceId } = useContext(PlayerContext);
    const { playbackState, setPlaybackState } = useContext(PlaybackContext);

    const [miniPlayerOpened, setMiniPlayerOpened] = useState(false);
    const [playingProgressMs, setPlayingProgressMs] = useState(null);
    const [showLyric, setShowLyric] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [seekProgress, setSeekProgress] = useState(false);
    const [volume, setVolume] = useState({percentage: null, mute: false,});
    const [seekVolume, setSeekVolume] = useState(false);
    const [volumeIcon, setVolumeIcon] = useState(null);
    const [showDevices, setShowDevices] = useState(false);

    const history = useHistory();
    const spotify = useSpotify();
    const player = usePlayer();
    const { fetchPlayback, seek, setVolume: volumeChangeHandler, transferPlayback } = player;

    const endTimeMin = (playbackState)
        ? new Date(playbackState.item.duration_ms).getMinutes()
        : '0';
    const endTimeSec = (playbackState)
        ? `${new Date(playbackState.item.duration_ms).getSeconds() < 10 ? '0' : ''}${new Date(playbackState.item.duration_ms).getSeconds()}`
        : '00';
    const currentTimeMin = (playbackState)
        ? new Date(playingProgressMs).getMinutes()
        : '0';
    const currentTimeSec = (playbackState)
        ? `${new Date(playingProgressMs).getSeconds() < 10 ? '0' : ''}${new Date(playingProgressMs).getSeconds()}`
        : '00';

    const { progress_ms: progressMs, item, device } = playbackState ?? {};

    // Check Song Progress
    useEffect(() => {
        if (progressMs) setPlayingProgressMs(progressMs);
    }, [progressMs]);

    // Fetch Playback
    useEffect(() => {
        let fetchInterval;
        if (token) fetchInterval = setInterval(() => fetchPlayback(), 1000);

        return (() => {
            clearInterval(fetchInterval);
        });
    }, [token, playingProgressMs, playbackState, item, fetchPlayback]);

    // Transfer Playback
    useEffect(() => {
        if (token && player.device !== deviceId) transferPlayback(deviceId);
    }, [token, player.device, deviceId, transferPlayback])

    // Set Playback State
    useEffect(() => {
        if (player.currentlyPlaying !== currentlyPlaying) setCurrentlyPlaying(player.currentlyPlaying);
        
        if (player.playbackState) setPlaybackState(player.playbackState);

        if (player.error !== null) {
            if (player.error.status === 401) console.log(player.error);
            if (player.error.status === 403 || player.error.body.message.includes('token expired')) {
              clearAuth();
              history.push('/');
            }
          }
    }, [player.device, deviceId, transferPlayback, player.currentlyPlaying, currentlyPlaying, setCurrentlyPlaying, player.playbackState, setPlaybackState, player.error, clearAuth, history]);

    // Set Favorite
    async function favoriteHandler() {
        if (!spotify.isTrackSaved(libraryCtx.savedTracks, currentlyPlaying.item.id)) {
            libraryCtx.addSavedTrack(currentlyPlaying.item);
            const success = await spotify.addTrackToSavedTracks(currentlyPlaying.item.id);
            if (!success) libraryCtx.removeSavedTrack(currentlyPlaying.item.id); 
        } else {
            libraryCtx.removeSavedTrack(currentlyPlaying.item.id);
            const success = await spotify.removeTrackFromSavedTracks(currentlyPlaying.item.id);
            if (!success) libraryCtx.addSavedTrack(currentlyPlaying.item); 
        }
    }

    // Play and Pause
    function playHandler() {
        if (playbackState && !playbackState.is_playing)
            player.playNonSong();
        else
            player.pause();
    }

    // Set Progress
    function setProgressHandler(percentage) {
        setPlayingProgressMs(Math.floor(percentage / 100 * playbackState.item.duration_ms));
        setSeekProgress(true);
    }

    // Seek Progress with timeout
    useEffect(() => {
        let timeout;
        if (playingProgressMs && seekProgress)
            timeout = setTimeout(() => {
                seek(playingProgressMs);
                setSeekProgress(false);
            }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [playingProgressMs, seekProgress, seek]);

    // Check Volume
    useEffect(() => {
        if (device && volume.percentage === null && !seekVolume) 
            setVolume((prevState) => { 
                return {...prevState, percentage: device.volume_percent}; 
            });
    }, [device, volume, seekVolume])

    // On Volume Handler
    function seekVolumeHandler(percentage) {
        setVolume({ mute: false, percentage: percentage });
        setSeekVolume(true);
    }

    // Set Is Mute
    function isMute(status) {
        setVolume(prevState => {
            return {...prevState, mute: status}
        })
    }

    // Mute Handler
    async function muteVolume() {
        if (!volume.mute) {
            isMute(true);

            const success = await player.mute();
            if (!success) isMute(false);
        }
        else {
            isMute(false)

            const success = await player.unmute(volume.percentage);
            if (!success) isMute(true);
        }
    }

    // On Seek Volume
    useEffect(() => {
        async function setVolumeAsynchronous() {
            const isSuccess = await volumeChangeHandler(volume.percentage);

            if (!isSuccess) {
                setVolume(prevState => {
                    return {...prevState, percentage: device.volume_percent}
                });
                setSeekVolume(false)
            }

            setSeekVolume(false);
        }
        
        let timeout;
        if (seekVolume)
            timeout = setTimeout(() => setVolumeAsynchronous(), 300);

        return () => {
            clearTimeout(timeout);
        }
    }, [device, seekVolume, volume, volumeChangeHandler]);

    useEffect(() => {
        if (volume.mute) setVolumeIcon(VolumeOffIcon);
        else if (volume.percentage > 50) setVolumeIcon(VolumeUpIcon);
        else if (volume.percentage > 1) setVolumeIcon(VolumeDownIcon);
        else if (volume.percentage <= 1) setVolumeIcon(VolumeMuteIcon);
    }, [volume])

    return (
        <div className={`bg-181818 border-t border-gray-800 shadow-lg shadow-inner flex gap-4 items-center justify-between p-4 ${props.className}`} >
            {/* Left */}
            < div className="basis-1/3 w-full flex gap-2 items-center">
                {
                    currentlyPlaying && (
                        <React.Fragment>
                            <img
                                src={currentlyPlaying.item.album.images[0].url}
                                alt={currentlyPlaying.item.name}
                                className="h-12 w-12" />
                            <div className="flex-grow truncate text-white ml-2">
                                <label className="text-sm cursor-pointer transition ease duration-200 hover:underline">{currentlyPlaying.item.name}</label>
                                <p className="text-xs opacity-70 cursor-pointer transition ease duration-200 hover:underline hover:opacity-100">
                                    {
                                        currentlyPlaying.item.artists
                                            .reduce((output, artist) => output.length < 1 ? output += artist.name : output += `, ${artist.name}`, '')
                                    }
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex gap-2 items-center">
                                <AnimatedIcon
                                    className="transform scale-75 opacity-70 hover:opacity-100"
                                    active={currentlyPlaying && spotify.isTrackSaved(libraryCtx.savedTracks, currentlyPlaying.item.id)}
                                    icon={FavoriteBorderIcon}
                                    activeIcon={FavoriteIcon}
                                    onClick={favoriteHandler} />
                                <AnimatedIcon
                                    className="transform scale-75 opacity-70 hover:opacity-100"
                                    active={miniPlayerOpened}
                                    icon={WebAssetOffRoundedIcon}
                                    activeIcon={WebAssetRoundedIcon}
                                    onClick={() => setMiniPlayerOpened(!miniPlayerOpened)} />
                            </div>
                        </React.Fragment>
                    )
                }
            </div>

            {/* Middle */}
            <div className="basis-1/3 w-full flex flex-col gap-4 justify-between">
                <div className="flex items-center justify-center gap-4 text-white">
                    <AnimatedIcon
                        className="transform scale-75 opacity-70 hover:opacity-100"
                        active={playbackState ? playbackState.shuffle_state : false}
                        icon={ShuffleRoundedIcon}
                        activeIcon={ShuffleRoundedIcon}
                        onClick={() => player.shuffle(playbackState.shuffle_state)}
                        showDot />
                    <span
                        className="transform scale-90 opacity-70 transition duration-200 ease-in-out hover:opacity-100 cursor-pointer"
                        onClick={() => player.prev()}
                    >
                        <SkipPreviousRoundedIcon />
                    </span>
                    <AnimatedIcon
                        className="transform scale-150 hover:scale-175"
                        active={playbackState ? playbackState.is_playing : false}
                        icon={PlayCircleRoundedIcon}
                        activeIcon={PauseCircleFilledRoundedIcon}
                        onClick={playHandler} />
                    <span
                        className="transform scale-90 opacity-70 transition duration-200 ease-in-out hover:opacity-100 cursor-pointer"
                        onClick={() => player.next()}
                    >
                        <SkipNextRoundedIcon />
                    </span>
                    <AnimatedIcon
                        className="transform scale-75 opacity-70 hover:opacity-100"
                        active={playbackState ? playbackState.repeat_state === REPEAT_STATES.CONTEXT : false}
                        secondActive={playbackState ? playbackState.repeat_state === REPEAT_STATES.TRACK : false}
                        icon={RepeatRoundedIcon}
                        activeIcon={RepeatRoundedIcon}
                        secondIcon={RepeatOneRoundedIcon}
                        showDot
                        onClick={() => player.repeat(playbackState.repeat_state)} />
                </div>
                <ProgressBar
                    percentage={playbackState ? Math.floor(playingProgressMs / playbackState.item.duration_ms * 100) : 0}
                    currentTime={`${currentTimeMin}:${currentTimeSec}`}
                    endTime={`${endTimeMin}:${endTimeSec}`}
                    onChange={setProgressHandler} />
            </div>

            {/* Right */}
            <div className="basis-1/3 w-full text-white flex gap-2 items-center justify-end">
                <AnimatedIcon 
                    className="transform scale-75 opacity-70 hover:opacity-100"
                    active={showLyric}
                    icon={FormatListBulletedRoundedIcon}
                    activeIcon={FormatListBulletedRoundedIcon}
                    showDot
                    onClick={() => setShowLyric(!showLyric)} />
                <AnimatedIcon 
                    className="transform scale-75 opacity-70 hover:opacity-100"
                    active={showQueue}
                    icon={PlaylistPlayIcon}
                    activeIcon={PlaylistPlayIcon}
                    showDot
                    onClick={() => setShowQueue(!showQueue)} />
                <div className="relative">
                    <button
                        className="transform scale-75 cursor-pointer opacity-70 transition ease duration-200 hover:opacity-100"
                        onClick={() => setShowDevices(!showDevices)}
                        onBlur={() => setShowDevices(false)}
                    >
                        <DevicesIcon />
                    </button>
                    <div>
                        <DevicePopup
                            className="absolute bottom-10 -left-32 -right-32"
                            show={showDevices} />
                    </div>
                </div>
                {/* <span className="transform scale-75 cursor-pointer opacity-70 transition ease duration-200 hover:opacity-100"><VolumeUpIcon /></span> */}
                <AnimatedIcon
                    className="transform scale-75 opacity-70 hover:opacity-100"
                    active={false}
                    icon={volumeIcon ? volumeIcon : VolumeUpIcon}
                    activeIcon={React.Fragment}
                    onClick={muteVolume} />
                <div className="w-20">
                    <ProgressBar
                        percentage={(volume.mute || volume.percentage === null) ? 0 : volume.percentage}
                        hideTime
                        onChange={seekVolumeHandler} />
                </div>
                <span className="transform scale-75 cursor-pointer opacity-70 transition ease duration-200 hover:opacity-100"><AspectRatioIcon /></span>
            </div>
        </div >
    )
});

export default HomeFooter;