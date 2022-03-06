import Input from "./Input";

function AgreementInputForm(props) {
    return (
        <div className={`flex items-center ${props.className}`}>
            <Input type="checkbox" name={props.name} value={props.value} />
            <label className={`ml-3 ${props.labelClassName}`}>{props.label}</label>
        </div>
    )
}

export default AgreementInputForm;