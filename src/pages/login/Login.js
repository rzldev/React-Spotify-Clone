import Button from '../../components/ui/button/Button';
import SpotifyLogo from '../../assets/spotify-logo-black.png';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import DialpadIcon from '@mui/icons-material/Dialpad';
import LoginForm from '../../components/login-form/LoginForm';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="container mx-auto max-w-120 flex flex-col gap-5 my-8">
            <img src={SpotifyLogo} alt="spotify-logo" className="w-24 md:w-40 mx-auto" />
            <h3 className="text-3xl md:text-4xl font-bold mx-auto tracking-tighter">To continue, log in to Spotify.</h3>

            {/* Buttons */}
            <div className="flex flex-col gap-3 px-8">
                <Button
                    className="py-2 bg-white hover:bg-blue-500 text-blue-500 hover:text-white font-bold uppercase rounded-full flex items-center justify-center gap-2 border-2 border-blue-500"
                    variant="contained"
                >
                    <FacebookRoundedIcon className="transform scale-90" />
                    Continue with Facebook
                </Button>
                <Button
                    className="py-2 bg-white hover:bg-black text-black hover:text-white font-bold uppercase rounded-full flex items-center justify-center gap-2 border-2 border-black"
                    variant="contained"
                >
                    <AppleIcon className="transform scale-90" />
                    Continue with Apple
                </Button>
                <Button
                    className="py-2 bg-white hover:bg-gray-700 text-gray-700 hover:text-white font-bold uppercase rounded-full flex items-center justify-center gap-2 border-2 border-gray-700"
                    variant="contained"
                >
                    <GoogleIcon className="transform scale-90" />
                    Continue with Google
                </Button>
                <Button
                    className="py-2 bg-white hover:bg-gray-700 text-gray-700 hover:text-white font-bold uppercase rounded-full flex items-center justify-center gap-2 border-2 border-gray-700"
                    variant="contained"
                >
                    <DialpadIcon className="transform scale-90" />
                    Continue with Phone Number
                </Button>
            </div>

            <span className="flex gap-4 items-center px-16">
                <hr className="w-full border-gray-300 mt-1" />
                <p className="text-gray-500 font-bold tracking-wide">or</p>
                <hr className="w-full border-gray-300 mt-1" />
            </span>

            {/* Login Form */}
            <LoginForm />

            <p className="font-medium text-center">Don't have an account? <Link className="spotify-green" to="/singup">Register</Link></p>
        </div>
    )
}

export default Login;