import { Link } from 'react-router-dom';
import SpotifyLogo from '../../assets/spotify-logo-black.png';
import SignupForm from '../../components/signup-form/SignupForm';

function SignUp() {
    return (
        <div className="container mx-auto max-w-120 flex flex-col gap-5 my-8">
            <img src={SpotifyLogo} alt="spotify-logo" className="w-24 md:w-40 mx-auto" />
            <h3 className="text-3xl md:text-4xl font-bold mx-auto tracking-tighter">Sign up for free to start listening.</h3>

            <div className="flex justify-center mt-4">
                <div className="px-8 py-3 bg-gray-500 text-white font-bold rounded-full tracking-tighter opacity-50 cursor-not-allowed">Sign up With Facebook</div>
            </div>

            <span className="flex gap-4 items-center px-16">
                <hr className="w-full border-gray-300 mt-1" />
                <p className="text-gray-500 font-bold tracking-wide">or</p>
                <hr className="w-full border-gray-300 mt-1" />
            </span>

            <SignupForm />

            <p className="font-medium text-center">Have an account? <Link className="spotify-green" to="/login">Login</Link></p>
        </div>
    )
}

export default SignUp;