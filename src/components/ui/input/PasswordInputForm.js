import Input from "./Input";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";

function PasswordInputForm(props) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={`flex flex-col gap-1 ${props.className}`}>
            <label
                className={`font-medium text-sm ${props.labelClassName}`}
            >
                {props.label}
            </label>
            <div className={`${props.inputClassName} rounded-md flex items-center ring-1 focus:ring-2 ${!props.inputIsValid && 'ring-red-500'}`}>
                <Input
                    className={`py-2 font-medium flex-grow ${props.inputIsValid ? 'text-gray-500' : 'text-red-500'}`}
                    type={visible ? 'text' : 'password'}
                    value={props.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    placeholder={props.placeholder} />
                <span className="transform scale-90 text-gray-500 cursor-pointer" onClick={() => setVisible(prevState => !prevState)}>
                    {
                        visible
                            ? <VisibilityIcon />
                            : <VisibilityOffIcon />
                    }
                </span>
            </div>
            {
                props.showForgotPassword && (
                    <a className="ml-auto mt-1 underline text-sm text-gray-700 hover-spotify-green font-medium" href="www.spotify.com">Forgot your password?</a>
                )
            }
            {
                !props.inputIsValid && (
                    <span className="flex">
                        <CloseRoundedIcon className="text-red-500 transform scale-75" />
                        <p className="text-xs font-bold text-red-500 mt-1">{props.errorMessage}</p>
                    </span>
                )
            }
        </div>
    )
}

export default PasswordInputForm;