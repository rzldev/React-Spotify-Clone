import { Link, NavLink } from 'react-router-dom';
import SpotifyLogo from '../../assets/spotify-logo.png';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import React, { useContext } from 'react';
import { LibraryContext } from '../../context/library-context';

const NAVIGATION = [
    {
        name: 'Home',
        to: '/',
        exact: true,
        logo: HomeRoundedIcon,
    },
    {
        name: 'Search',
        to: '/search',
        exact: false,
        logo: SearchRoundedIcon,
    },
    {
        name: 'Library',
        to: '/library',
        exact: false,
        logo: VideoLibraryRoundedIcon,
    },
    {
        name: 'Create Playlist',
        to: '/create-playlist',
        exact: false,
        logo: AddBoxIcon,
    },
    {
        name: 'Liked Songs',
        to: '/liked-songs',
        exact: false,
        logo: FavoriteIcon,
    },
]

const HomeSidebar = React.memo((props) => {
    const navigation = NAVIGATION;

    const { playlists } = useContext(LibraryContext);

    return (
        <nav className={`${props.className} w-64 p-2 flex flex-col justify-between`}>
            {/* Top */}
            <div>
                {/* Logo */}
                <Link to="/">
                    <img className="w-32 m-4" src={SpotifyLogo} alt="spotify-logo" />
                </Link>

                {/* Nav */}
                <div className="text-sm text-white flex flex-col font-bold mt-6">
                    {
                        navigation.map((nav, index) => (
                            <Nav key={index} nav={nav} className={`px-4 py-2.5 ${index === 3 && 'mt-4'}`} />
                        ))
                    }
                </div>
                <hr className="mx-4 my-2 border-gray-292929" />
                <ul className="mx-4 my-2 flex flex-col gap-2">
                    {
                        playlists.length > 0 && playlists.map(item => (
                            <NavLink
                                key={item.id}
                                to={`/playlist/${item.id}`}
                                activeClassName="opacity-100"
                                className="text-sm text-white font-medium opacity-70 cursor-pointer transition ease-in-out duration-200 hover:opacity-100"
                            >
                                {item.name}
                            </NavLink>
                        ))
                    }
                </ul>
            </div>

            {/* Bottom */}
            <span className="text-white flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 mx-auto">
                <DownloadForOfflineOutlinedIcon />Install App
            </span>
        </nav>
    )
})

const Nav = React.memo((props) => {
    const nav = props.nav;

    return (
        <NavLink
            className={`opacity-70 transition duration-200 ease hover:opacity-100 rounded ${props.className}`}
            to={nav.to}
            exact={nav.exact}
            activeClassName="bg-gray-292929 opacity-100"
        >
            <nav.logo className="text-white mr-4" />{nav.name}
        </NavLink>
    )
})

export default HomeSidebar;