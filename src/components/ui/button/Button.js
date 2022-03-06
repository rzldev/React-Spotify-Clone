function Button(props) {
    return (
        <button
            {...props}
            className={`px-2 py-1 text-xs transition duration-300 ease-in-out transform scale-105 ${props.className}`}
        >
            {props.children}
        </button>
    )
}

export default Button;