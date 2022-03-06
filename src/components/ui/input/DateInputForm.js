import useInput, { useInputRules } from "../../../hooks/use-input";
import './NumberInputForm.css';
import _ from 'lodash';
import Dropdown from "../dropdown/Dropdown";
import { useEffect, useState } from "react";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const years = _.range(new Date().getFullYear(), (new Date().getFullYear() - 100));

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
];

function DateInputForm(props) {
    const {onChange: dataChangeHandler} = props;

    const [days, setDays] = useState([]);

    const { isEmpty } = useInputRules();

    const day = useInput([isEmpty('Select your birth day.', true)]);
    const month = useInput([isEmpty('Select your birth month.', true)]);
    const year = useInput([isEmpty('Select your birth year.', true)]);

    useEffect(() => {
        year.isValid && month.isValid && setDays(_.range(1, new Date(year.value, months.indexOf(month.value) + 1, 0).getDate()));
    }, [year.value, month.value, year.isValid, month.isValid]);

    useEffect(() => {
        (year.isValid && month.isValid && day.isValid) && dataChangeHandler(new Date(`${day.value}-${month.value}-${year.value}`).toISOString());
    }, [year.value, year.isValid, month.value, month.isValid, day.value, day.isValid, dataChangeHandler]);

    return (
        <div className={`flex flex-col gap-1 ${props.className}`}>
            <label className={`font-medium text-sm ${props.labelClassName}`}>
                {props.label}
            </label>

            <div className="flex items-center gap-3 mt-2">
                {/* Year */}
                <div className="flex flex-col gap-2 flex-shrink-0 w-20">
                    <label className="font-medium text-sm">Year</label>
                    <Dropdown
                        inputClassName={`px-3 py-2 ring-1 focus:ring-2 w-full text-gray-500 cursor-pointer z-50 ${props.inputClassName}`}
                        list={years}
                        value={year.value}
                        placeholder="Year"
                        onChange={year.inputSetHandler}
                        onBlur={year.inputBlurHandler} />
                </div>

                {/* Month */}
                <div className="relative flex flex-col gap-2 flex-grow">
                    <label className="font-medium text-sm">Month</label>
                    <Dropdown
                        inputClassName={`px-3 py-2 ring-1 focus:ring-2 w-full text-gray-500 cursor-pointer z-50 ${props.inputClassName}`}
                        list={months}
                        value={month.value}
                        placeholder="Month"
                        onChange={month.inputSetHandler}
                        onBlur={month.inputBlurHandler} />
                </div>

                {/* Day */}
                <div className="flex flex-col gap-2 flex-shrink-0 w-16">
                    <label className="font-medium text-sm">Day</label>
                    <Dropdown
                        inputClassName={`px-3 py-2 ring-1 focus:ring-2 w-full text-gray-500 cursor-pointer z-50 ${props.inputClassName}`}
                        list={days}
                        value={day.value}
                        placeholder="Day"
                        onChange={day.inputSetHandler}
                        onBlur={day.inputBlurHandler} />
                </div>
            </div>

            {/* Error message */}
            {
                (!year.inputIsValid || !month.inputIsValid || !day.inputIsValid) && (
                    <div className="mt-2">
                        {
                            !year.inputIsValid && (<ErrorMessage errorMessage={year.errorMessage} />)
                        }
                        {
                            !month.inputIsValid && (<ErrorMessage errorMessage={month.errorMessage} />)
                        }
                        {
                            !day.inputIsValid && (<ErrorMessage errorMessage={day.errorMessage} />)
                        }
                    </div>
                )
            }
        </div>
    )
}

function ErrorMessage(props) {
    return (
        <span className="flex">
            <CloseRoundedIcon className="text-red-500 transform scale-75" />
            <p className="text-xs font-bold text-red-500 mt-1">{props.errorMessage}</p>
        </span>
    )
}

export default DateInputForm;