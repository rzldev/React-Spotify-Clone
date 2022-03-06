import useInput, { useInputRules } from "../../hooks/use-input";
import AgreementInputForm from "../ui/input/AgreementInputForm";
import DateInputForm from "../ui/input/DateInputForm";
import InputForm from "../ui/input/InputForm";
import PasswordInputForm from "../ui/input/PasswordInputForm";
import RadioInputForm from "../ui/input/RadioInputForm";

const genders = ['Male', 'Female', 'Non-binary']

function SignupForm() {

    const { isEmpty, emailInvalid, passwordTooShort } = useInputRules();

    const email = useInput([isEmpty('your email.'), emailInvalid]);
    const emailConfirmation = useInput([isEmpty('your email again.'), emailInvalid]);
    const password = useInput([isEmpty('a password.'), passwordTooShort]);
    const username = useInput([isEmpty('a name for your profile.')]);
    const dateBirth = useInput([isEmpty()]);
    const gender = useInput([isEmpty()]);

    const formIsValid = (email.isValid && emailConfirmation.isValid && password.isValid && username.isValid && dateBirth.isValid && gender.isValid);

    function submitFormHandler(event) {
        event.preventDefault();

        console.log(`email: ${email.value}`);
        console.log(`email confirmation: ${emailConfirmation.value}`);
        console.log(`password: ${password.value}`);
        console.log(`username: ${username.value}`);
        console.log(`date birth: ${dateBirth.value}`);
        console.log(`gender: ${gender.value}`);
    }

    return (
        <form className="px-8 flex flex-col gap-4">
            <center><h4 className="text-lg font-bold mx-auto">Sign up with your email address</h4></center>

            <InputForm
                labelClassName="font-bold"
                inputClassName="px-2 py-3 font-medium ring-gray-500"
                label="What's your email?"
                type="email"
                value={email.value}
                onChange={email.inputChangeHandler}
                onBlur={email.inputBlurHandler}
                inputIsValid={email.inputIsValid}
                errorMessage={email.errorMessage}
                placeholder="Enter your email" />
            <InputForm
                labelClassName="font-bold"
                inputClassName="px-2 py-3 font-medium ring-gray-500"
                label="Confirm your email"
                type="email"
                value={emailConfirmation.value}
                onChange={emailConfirmation.inputChangeHandler}
                onBlur={emailConfirmation.inputBlurHandler}
                inputIsValid={emailConfirmation.inputIsValid}
                errorMessage={emailConfirmation.errorMessage}
                placeholder="Enter your email again" />
            <PasswordInputForm
                labelClassName="font-bold"
                inputClassName="px-2 py-1 font-medium ring-gray-500"
                label="Create a password"
                value={password.value}
                onChange={password.inputChangeHandler}
                onBlur={password.inputBlurHandler}
                inputIsValid={password.inputIsValid}
                errorMessage={password.errorMessage}
                placeholder="Create a password" />
            <InputForm
                labelClassName="font-bold"
                inputClassName="px-2 py-3 font-medium ring-gray-500"
                label="What should we call you?"
                type="text"
                value={username.value}
                onChange={username.inputChangeHandler}
                onBlur={username.inputBlurHandler}
                inputIsValid={username.inputIsValid}
                errorMessage={username.errorMessage}
                placeholder="Enter a profile name" />
            <DateInputForm
                labelClassName="font-bold"
                inputClassName="py-3 font-medium ring-gray-500"
                label="What's your date of birth?"
                onChange={dateBirth.inputSetHandler} />
            <RadioInputForm
                name="gender"
                labelClassName="font-bold"
                label="What's your gender?"
                inputClassName="text-sm"
                options={genders}
                onChange={gender.inputSetHandler} />
            <AgreementInputForm
                label="Share my registration data with Spotify's content providers for marketing purposes."
                className="mt-4"
                labelClassName="text-sm font-medium" />

            <p className="text-xs font-medium text-center px-8">
                By clicking on sign-up, you agree to Spotify's <a className="spotify-green" href="https://www.spotify.com/us/legal/end-user-agreement/">Terms and Conditions of Use.</a>
            </p>

            <p className="text-xs font-medium text-center px-8">
                To learn more about how Spotify collects, uses, shares and protects your personal data, please see <a className="spotify-green" href="https://www.spotify.com/us/legal/privacy-policy/">Spotify's Privacy Policy</a>.
            </p>

            <div className="flex justify-center">
                <button
                    className={`font-bold uppercase text-sm px-12 py-4 rounded-full opacity-90 transition ease-in-out duration-300 transform
                        ${!formIsValid ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'cursor-pointer bg-spotify-green text-white hover:scale-105 hover:opacity-100'}`}
                    onClick={submitFormHandler}
                    disabled={!formIsValid}
                >
                    Sign up
                </button>
            </div>
        </form>
    )
}

export default SignupForm;