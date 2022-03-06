import Button from "./Button";

function ButtonForm(props) {
    return (
        <Button
            className={`font-bold uppercase text-sm px-3 py-2 rounded-full transition ease-in-out duration-300 transform ${props.className}
                        ${!props.formIsValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={props.onClick}
            disabled={!props.formIsValid}
        >
            {props.children}
        </Button>
    )
}

export default ButtonForm;