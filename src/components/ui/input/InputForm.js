import Input from "./Input";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function InputForm(props) {
    return (
        <div className={`flex flex-col gap-1 ${props.className}`}>
            <label className={`font-medium text-sm ${props.labelClassName}`}>{props.label}</label>
            <Input
                className={`px-3 py-2 ring-1 focus:ring-2 focus:font-medium ${props.inputClassName}
                    ${props.inputIsValid ? 'text-gray-500' : 'text-red-500 ring-red-500'}`}
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                placeholder={props.placeholder} />
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

export default InputForm;