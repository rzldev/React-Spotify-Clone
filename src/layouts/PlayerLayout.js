import React, { Fragment, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import HomeSidebar from "../components/home-sidebar/HomeSidebar";
import HomeFooter from '../components/home-footer/HomeFooter';
import HomeHeader from '../components/home-header/HomeHeader';
import { BreakPointSize } from '../Constanta';
import { AuthContext } from '../context/auth-context';
import { UIContext } from '../context/ui-context';
// import styles from './PlayerLayout.module.css';

function PlayerLayout(props) {
    const { refreshPage, bodyColor, headerColor, setNumItemList, setRefreshPage } = useContext(UIContext);
    const { token } = useContext(AuthContext);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const size = BreakPointSize;

    // const prevScrollY = useRef(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [goingUp, setGoingUp] = useState(true);

    // Window Size Listener
    useLayoutEffect(() => {
        function updateWidth() {
            setScreenWidth(window.innerWidth)
        }

        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        if (screenWidth < size.SM) {
            setNumItemList(1);
        } else if (screenWidth < size.MD) {
            setNumItemList(2);
        } else if (screenWidth < size.LG) {
            setNumItemList(3);
        } else if (screenWidth < size.XL) {
            setNumItemList(3);
        } else {
            setNumItemList(4);
        }
    }, [setNumItemList, screenWidth, size]);

    const scrollHandler = useCallback((event) => {
        const currentScrollY = event.target.scrollTop;

        if (scrollPosition < currentScrollY && goingUp) {
            setGoingUp(false);
        }
        if (scrollPosition > currentScrollY && !goingUp) {
            setGoingUp(true);
        }

        if (currentScrollY <= 200 && goingUp && currentScrollY > scrollPosition) setScrollPosition(currentScrollY - 100);
        if (currentScrollY >= 100 && !goingUp && currentScrollY < scrollPosition) setScrollPosition(currentScrollY - 100);
        if (currentScrollY > 200 && scrollPosition < 200) setScrollPosition(100);
    }, [scrollPosition, goingUp]);

    useLayoutEffect(() => {
        window.addEventListener("scroll", scrollHandler, true);

        return () => window.removeEventListener("scroll", scrollHandler);;
    }, [scrollHandler]);

    useEffect(() => {
        if (refreshPage) {
            setScrollPosition(0);
            setRefreshPage(false);
        }
    }, [refreshPage, setRefreshPage]);

    const headerHexToRGBA = (hex = null, opacity) => {
        if (hex === null) return `rgba(${24}, ${24}, ${24}, ${opacity})`

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    let layout;
    if (token) {
        layout = (
            <div className="h-screen flex flex-col max-h-screen overflow-hidden">
                <div className="flex overflow-auto h-screen">
                    {/* Sidebar */}
                    <HomeSidebar className="flex-shrink-0 bg-black overflow-x-hidden overflow-y-auto" />

                    {/* Body */}
                    <div
                        className={`flex-grow overflow-auto`}
                        style={{ background: `linear-gradient(180deg, ${headerHexToRGBA(bodyColor ?? '#292929', 1)} 0%, ${headerHexToRGBA(bodyColor ?? '#181818', 1)} 100%)` }}
                    >
                        <HomeHeader
                            className="sticky top-0 z-10"
                            scrollPosition={scrollPosition}
                            style={{ backgroundColor: headerHexToRGBA(headerColor, (scrollPosition / 100)) }} />

                        {props.children}
                    </div>
                </div>

                <HomeFooter className="flex-shrink-0 z-10" />
            </div>
        )
    } else {
        layout = (
            <Fragment>
                {props.children}
            </Fragment>
        )
    }

    return layout;
}

export default PlayerLayout;