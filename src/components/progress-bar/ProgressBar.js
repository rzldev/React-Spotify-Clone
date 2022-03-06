import { useEffect, useRef } from "react";
import style from './ProgressBar.module.css';

function ProgressBar(props) {
    const { percentage } = props;

    const inputRef = useRef();

    useEffect(() => {
        if (percentage)
            inputRef.current.style.backgroundSize = `${percentage}% 100%`;
    }, [percentage])

    return (
        <div className={`h-2 py-0.5 flex items-center gap-2 ${props.className}`}>
            {!props.hideTime && <p className="text-white opacity-70 text-2xs font-medium">{props.currentTime}</p>}
            <input 
                ref={inputRef}
                className={style.spotifySlider}
                type="range" 
                min="0" 
                max="100" 
                value={percentage ?? 0}
                onChange={(e) => props.onChange(e.target.value)} />
            {!props.hideTime && <p className="text-white opacity-70 text-2xs font-medium">{props.endTime}</p>}
        </div>
    )
}

export default ProgressBar;