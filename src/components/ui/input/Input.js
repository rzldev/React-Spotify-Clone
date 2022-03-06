function Input(props) {
    return (
        <input
            {...props}
            className={`rounded-md px-2 py-1 ring-0 ring-inset transition duration-300 transform
                focus:outline-none ${props.className}`} />
    )
}

export default Input