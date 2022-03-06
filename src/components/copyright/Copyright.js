function Copyright(props) {
    const { className, type, text } = props;

    let copyright
    switch (type) {
        case 'P':
            copyright = (<span className={className ?? 'text-2xs text-gray-400'}>&#9439;{text.replace('(P)', '')}</span>);
            break;

        case 'C':
            copyright = (<span className={className ?? 'text-2xs text-gray-400'}>&#9400;{text.replace('(C)', '')}</span>);
            break;

        default:
            copyright = (<span className={className ?? 'text-2xs text-gray-400'}>{text}</span>);
            break;
    }

    return copyright;
}

export default Copyright;