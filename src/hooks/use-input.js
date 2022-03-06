import { useCallback } from 'react';
import { useReducer } from 'react';

const defaultInputState = (initValue = '') => {
    return {
        value: initValue,
        touched: false,
        errorMessage: '',
    }
}

export const inputActionTypes = {
    INPUT_CHANGE: 'INPUT_CHANGE',
    INPUT_BLUR: 'INPUT_BLUR',
    RESET_INPUT: 'RESET_INPUT',
}

const inputReducer = (state, action) => {
    switch (action.type) {
        case inputActionTypes.INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
            }

        case inputActionTypes.INPUT_BLUR:
            for (const val of action.validation) {
                const validation = val(state.value);

                if (validation.rule) {
                    return {
                        ...state,
                        touched: true,
                        errorMessage: validation.errorMessage
                    }
                }
            }

            return {
                ...state,
                touched: false,
                errorMessage: '',
            }

        case inputActionTypes.RESET_INPUT:
            return defaultInputState;

        default:
            return defaultInputState;
    }
}

const useInput = (rules, initState = '') => {
    const [inputState, dispatchInput] = useReducer(inputReducer, defaultInputState(initState));

    const valueIsValid = rules.reduce((output, element) => output && !element(inputState.value).rule, true);

    let inputIsValid = true;
    if (inputState.touched) inputIsValid = valueIsValid;

    const inputChangeHandler = useCallback((event) => {
        dispatchInput({
            type: inputActionTypes.INPUT_CHANGE,
            value: event.target.value,
        })
    }, []);

    const inputSetHandler = useCallback((value) => {
        dispatchInput({
            type: inputActionTypes.INPUT_CHANGE,
            value: value,
        })
    }, []);

    const inputBlurHandler = useCallback(() => {
        dispatchInput({
            type: inputActionTypes.INPUT_BLUR,
            validation: rules,
        })
    }, [rules]);

    const inputResetHandler = useCallback(() => {
        dispatchInput({
            type: inputActionTypes.RESET_INPUT,
        })
    }, []);

    return {
        value: inputState.value,
        isValid: valueIsValid,
        inputIsValid,
        errorMessage: inputState.errorMessage,
        inputChangeHandler,
        inputSetHandler,
        inputBlurHandler,
        inputResetHandler
    }
}

export default useInput;

export const useInputRules = () => {
    
    const isEmpty = (additionalMessage = '', rewriteMessage = false) => {
        return (value) => {
            return {
                rule: value.toString().trim().length === 0,
                errorMessage: rewriteMessage ? additionalMessage : `You need to enter ${additionalMessage}`,
            }
        }
    }

    const emailInvalid = (value) => {
        return {
            rule: !(value.includes('@') && value.split('@')[1].includes('.')),
            errorMessage: 'This email is invalid. Make sure it\'s written like example@email.com.',
        }
    }

    const passwordTooShort = (value) => {
        return {
            rule: value.trim().length < 8,
            errorMessage: 'Your password is too short.'
        }
    }

    return {
        isEmpty,
        emailInvalid,
        passwordTooShort,
    }
}