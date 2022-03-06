import { useEffect } from "react";
import useInput, { useInputRules } from "../../../hooks/use-input";
import Input from "./Input";

function RadioInputForm(props) {
    const {onChange: changeDataHandler} = props;

    const { isEmpty } = useInputRules();
    const data = useInput([isEmpty()]);

    useEffect(() => {
        if (data.isValid) {
            changeDataHandler(data.value);
        }
    }, [data.isValid, data.value, changeDataHandler]);

    return (
        <div className="flex flex-col gap-4">
            <label className={`font-medium text-sm ${props.labelClassName}`}>{props.label}</label>
            <div className="flex flex-wrap gap-3">
                {
                    props.options.map((option, index) => (
                        <div key={index} className={`flex items-center gap-2 ${props.inputClassName}`} onClick={() => data.inputSetHandler(option)}>
                            <Input
                                className="cursor-pointer"
                                type="radio"
                                name={props.name}
                                value={option}
                                readOnly
                                checked={option === data.value} />
                            <label className="font-medium cursor-pointer">{option}</label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default RadioInputForm;