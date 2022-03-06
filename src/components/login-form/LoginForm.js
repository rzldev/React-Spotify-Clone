import useInput, { useInputRules } from "../../hooks/use-input";
import ButtonForm from "../ui/button/ButtonForm";
import AgreementInputForm from "../ui/input/AgreementInputForm";
import InputForm from "../ui/input/InputForm";
import PasswordInputForm from "../ui/input/PasswordInputForm";

function LoginForm(props) {
    const { isEmpty, passwordTooShort } = useInputRules();

    const username = useInput([isEmpty('a name for your profile.')]);
    const password = useInput([isEmpty('a password.'), passwordTooShort]);

    const formIsValid = username.isValid && password.isValid;

    return (
        <form className={`px-8 flex flex-col gap-4 ${props.className}`}>
            <center><h4 className="text-lg font-bold mx-auto">Log in with your email address</h4></center>

            <InputForm
                labelClassName="font-bold"
                inputClassName="px-2 py-3 font-medium ring-gray-500"
                label="Email address or username"
                type="text"
                value={username.value}
                onChange={username.inputChangeHandler}
                onBlur={username.inputBlurHandler}
                inputIsValid={username.inputIsValid}
                errorMessage={username.errorMessage}
                placeholder="Email address or username" />
            <PasswordInputForm
                labelClassName="font-bold"
                inputClassName="px-2 py-1 font-medium ring-gray-500"
                label="Password"
                value={password.value}
                onChange={password.inputChangeHandler}
                onBlur={password.inputBlurHandler}
                inputIsValid={password.inputIsValid}
                errorMessage={password.errorMessage}
                placeholder="Password"
                showForgotPassword />
            <AgreementInputForm
                label="Remember me"
                className="mt-4"
                labelClassName="font-medium text-gray-500" />
            <ButtonForm
                className={`py-3 ${formIsValid ? 'bg-gray-300 text-white' : 'border-2 border-spotify-green spotify-green hover-bg-spotify-green hover:text-white '}`}
                formIsValid={!formIsValid}
            >
                Login
            </ButtonForm>
        </form>
    )
}

export default LoginForm;