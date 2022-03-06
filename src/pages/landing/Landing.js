import { Link } from 'react-router-dom';
import SpotifyLogo from '../../assets/spotify-logo.png';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import './Landing.css';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react'
import useSpotify from '../../hooks/use-spotify';

function Landing() {
    const spotify = useSpotify();

    const [showHeaderMenu, setShowHeaderMenu] = useState(false);

    return (
        <div className="flex flex-col overflow-x-hidden overflow-y-auto">
            {/* Header */}
            <div className="fixed top-0 inset-x-0 bg-black w-full z-20">
                <div className="container mx-auto my-4 px-4 flex justify-between items-center">
                    <img className="w-24 cursor-pointer" src={SpotifyLogo} alt="spotify-logo" />

                    <span className={`relative block md:hidden z-20 transition ease-in-out duration-300 transform  ${showHeaderMenu && 'rotate-90'}`} onClick={() => setShowHeaderMenu(prevState => !prevState)}>
                        <MenuRoundedIcon
                            className={`absolute inset-0 h-4 w-4 text-white cursor-pointer transition ease-in-out duration-150
                                ${!showHeaderMenu ? 'opacity-100' : 'opacity-0'}`} />
                        <CloseRoundedIcon
                            className={`h-4 w-4 text-white cursor-pointer transition ease-in-out delay-150 duration-150
                                ${showHeaderMenu ? 'opacity-100' : 'opacity-0'}`} />
                    </span>

                    <Transition.Root as={Fragment} show={showHeaderMenu}>
                        <div className="absolute overflow-hidden">
                            <Transition.Child
                                as={Fragment}
                                enter="transition duration-300 ease-in-out"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition duration-300 ease-in-out"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-80" onClick={() => setShowHeaderMenu(false)} />
                            </Transition.Child>

                            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition duration-300 ease-in-out transform"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition duration-300 ease-in-out transform"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <div className="w-80 bg-black text-white font-bold px-8 pt-16">
                                        <div className="flex flex-col text-2xl gap-3">
                                            <Link to="/premium" className="transition duration-150 ease-in-out hover-spotify-green">Premium</Link>
                                            <Link to="/support" className="transition duration-150 ease-in-out hover-spotify-green">Support</Link>
                                            <Link to="/download" className="transition duration-150 ease-in-out hover-spotify-green">Download</Link>
                                            <hr className="my-2" />
                                            <Link to="/signup" className="font-medium text-xl transition duration-150 ease-in-out hover-spotify-green">Sign up</Link>
                                            <Link to="/login" className="font-medium text-xl transition duration-150 ease-in-out hover-spotify-green">Log in</Link>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </div>
                    </Transition.Root>

                    <div className="hidden text-white font-bold md:flex gap-4">
                        <Link to="/premium">Premium</Link>
                        <Link to="/support">Support</Link>
                        <Link to="/download">Download</Link>
                        <div className="border-l-2" />
                        <Link to="/signup">Sign up</Link>
                        <Link to="/login">Log in</Link>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="relative bg-blue-800 h-screen flex flex-col items-center justify-center">
                <div className="circle-1 bg-spotify-green" />
                <div className="circle-2 bg-spotify-green rounded-full" />
                <div className="circle-3 bg-spotify-green rounded-full" />
                <div className="circle-4 bg-spotify-green rounded-full" />

                <div className="text-center w-160">
                    <h1 className="spotify-green font-bold text-8xl">Listening is everything</h1>
                    <p className="spotify-green font-bold mt-6 mx-32">Millions of songs and podcasts. No credit card needed.</p>
                </div>
                <a
                    href={spotify.accessUri}
                    className="bg-spotify-green text-blue-800 font-bold uppercase text-sm mt-10 px-6 py-3 rounded-full opacity-90
                        transition ease-in-out duration-300 transform hover:scale-105 hover:opacity-100"
                >
                    Get spotify free
                </a>
            </div>

            {/* About */}
            <div className="w-full bg-black px-4 sm:px-4 md:px-8 py-8 z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 container max-auto">
                    <img src={SpotifyLogo} alt="spotify-logo" className="w-24 md:w-32 mb-6 sm:col-span-2 md:col-span-1" />

                    <div className="flex flex-col gap-3 text-white font-medium my-6">
                        <h4 className="text-gray-500 font-bold">Company</h4>
                        <Link to="/about">About</Link>
                        <Link to="/jobs">Jobs</Link>
                        <Link to="for-the-record">For the record</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-white font-medium my-6">
                        <h4 className="text-gray-500 font-bold">Communities</h4>
                        <Link to="/about">For Artists</Link>
                        <Link to="/jobs">Developers</Link>
                        <Link to="/advertising">Advertising</Link>
                        <Link to="/inventors">Investors</Link>
                        <Link to="/vendors">Vendors</Link>
                    </div>

                    <div className="flex flex-col gap-3 text-white font-medium my-6">
                        <h4 className="text-gray-500 font-bold">Useful Links</h4>
                        <Link to="/advertising">Support</Link>
                        <Link to="/advertising">Web Player</Link>
                        <Link to="/advertising">For Mobile App</Link>
                    </div>

                    <div className="flex gap-3 my-6">
                        <span className="h-10 w-10 p-2 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-white">
                            <InstagramIcon />
                        </span>
                        <span className="h-10 w-10 p-2 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-white">
                            <TwitterIcon />
                        </span>
                        <span className="h-10 w-10 p-2 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-white">
                            <FacebookOutlinedIcon />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing;