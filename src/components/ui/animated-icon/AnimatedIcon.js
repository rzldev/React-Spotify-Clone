import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

const AnimatedIcon = React.memo((props) => {
    const { icon: Icon, activeIcon: ActiveIcon, secondIcon: SecondIconActive, active, secondActive } = props;

    const [isActive, setIsActive] = useState(active);
    const [isSecondActive, setIsSecondActive] = useState(secondActive);

    useEffect(() => {
        if (active !== null) setTimeout(() => setIsActive(active), 300);
        if (secondActive !== null) setTimeout(() => setIsSecondActive(secondActive), 300);
    }, [active, secondActive]);

    return (
        <div
            className={`cursor-pointer transition ease duration-200 ${props.className}`}
            onClick={props.onClick}
        >
            <Transition
                as={Fragment}
                show={(!active && (!secondActive ?? false)) ?? false}
                enterFrom="scale-0"
                enterTo="scale-100"
                leaveFrom="scale-100"
                leaveTo="scale-0"
            >
                <div className="text-white transition ease-in-out duration-300 delay-300 transform">
                    {!isActive && !(isSecondActive ?? false) && (<Icon />)}
                </div>
            </Transition>
            <Transition
                as={Fragment}
                show={active ?? false}
                enterFrom="scale-0"
                enterTo="scale-100"
                leaveFrom="scale-100"
                leaveTo="scale-0"
            >
                <div className="text-spotify transition ease-in-out duration-300 delay-300 transform  relative">
                    {isActive && (<ActiveIcon />)}
                    {props.showDot && isActive ? (<CircleRoundedIcon className="absolute -bottom-4 inset-x-0 transform scale-25" />) : null}
                </div>
            </Transition>
            <Transition
                as={Fragment}
                show={secondActive ?? false}
                enterFrom="scale-0"
                enterTo="scale-100"
                leaveFrom="scale-100"
                leaveTo="scale-0"
            >
                <div className="text-spotify transition ease-in-out duration-300 delay-300 transform  relative">
                    {isSecondActive && (<SecondIconActive />)}
                    {props.showDot && isSecondActive ? (<CircleRoundedIcon className="absolute -bottom-4 inset-x-0 transform scale-25" />) : null}
                </div>
            </Transition>
        </div>
    )
});

export default AnimatedIcon;