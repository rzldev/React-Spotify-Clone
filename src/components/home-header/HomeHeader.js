import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import Input from '../ui/input/Input';
import { Route, useHistory } from 'react-router-dom';
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth-context';
import { Transition } from '@headlessui/react';

const HomeHeader = React.memo((props) => {
    const history = useHistory();
    const pathname = history.location.pathname;

    const { user } = useContext(AuthContext);

    const [showAccountOption, setShowAccountOption] = useState(false);
    const [searchParam, setSearchParam] = useState(null);

    const submitSearchHandler = useCallback((event = null) => {
        if (event) event.preventDefault();

        if (searchParam === null) return;

        history.push(`/search/${searchParam}`);
    }, [searchParam, history]);

    useEffect(() => {
        if (pathname && pathname.split('/').length > 2 && pathname.split('/')[1].toLowerCase() === 'search') setSearchParam(pathname.split('/')[2]);
    }, [pathname]);

    useEffect(() => {
        const timer = setTimeout(() => submitSearchHandler(), 1000);

        return () => { 
            clearTimeout(timer) 
        }
    }, [searchParam, submitSearchHandler]);

    return (
        <div className={`flex justify-between items-center gap-4 px-3 py-4 ${props.className}`} style={props.style}>
            <div className="flex w-full max-w-md items-center gap-4">
                <span className="text-white bg-white bg-opacity-10 rounded-full p-1 flex items-center justify-center my-1">
                    <ArrowBackIosNewRoundedIcon className="transform scale-75" />
                </span>

                <Route path="/search">
                    <form className="bg-white rounded-full px-4 h-10 flex-grow flex items-center justify-center" onSubmit={submitSearchHandler}>
                        <SearchIcon />
                        <Input
                            className="flex-grow"
                            placeholder="Artists, songs or podcasts"
                            value={searchParam ?? ''}
                            onChange={(event) => setSearchParam(event.target.value)} />
                    </form>
                </Route>
            </div>

            <button className="relative"
                onBlur={() => setShowAccountOption(false)}
            >
                <div
                    className="text-white cursor-pointer rounded-full flex items-center justify-center gap-2 p-2 bg-white bg-opacity-10 transition duration-200 hover:bg-white hover:bg-opacity-10 z-20"
                    onClick={() => setShowAccountOption(!showAccountOption)}
                >
                    <AccountCircleRoundedIcon className="transform scale-125" />
                    <p className="text-sm font-bold flex-grow max-w-32 truncate">{user && user.display_name}</p>
                    <ArrowDropDownIcon />
                </div>
                <Transition
                    show={showAccountOption}
                    as={Fragment}
                    enterFrom="opacity-0 -translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-4"
                >
                    <div className="absolute top-12 inset-x-0 bg-black px-2 py-2 rounded-lg transition duration-300 transform z-20">
                        <ul className="flex flex-col text-sm font-medium text-white cursor-pointer">
                            <li className="px-2 py-1.5 rounded-md transition ease-in-out duration-200 hover:bg-white hover:bg-opacity-10">Account</li>
                            <li className="px-2 py-1.5 rounded-md transition ease-in-out duration-200 hover:bg-white hover:bg-opacity-10">Profile</li>
                            <li className="px-2 py-1.5 rounded-md transition ease-in-out duration-200 hover:bg-white hover:bg-opacity-10">Logout</li>
                        </ul>
                    </div>
                </Transition>
            </button>
        </div>
    )
});

export default HomeHeader;