import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react"
import Input from "../input/Input";

function Dropdown(props) {
    const [show, setShow] = useState(false);

    return (
        <div className={`relative z-20 ${props.className}`}>
            <Input
                className={`px-3 py-2 ring-1 focus:ring-2 w-full text-gray-500 cursor-pointer ${props.inputClassName}`}
                type="text"
                readOnly
                value={props.value}
                placeholder={props.placeholder}
                onClick={() => setShow(true)}
                onBlur={() => { setShow(false); props.onBlur(); }} />
            <Transition
                as={Fragment}
                show={show}
                enter="transition duration-300 ease-in-out transform"
                enterFrom="-translate-y-8 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition duration-300 ease-in-out transform"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-8 opacity-0"
            >
                <ul className="absolute inset-x-0 top-12 bg-white max-h-64 w-full overflow-auto rounded-lg border border-gray-300 px-3 py-2 flex flex-col">
                    {
                        props.list.length > 0 && (
                            props.list.map(item => (
                                <li className="py-1 cursor-pointer" key={item} onClick={() => props.onChange(item)}>{item}</li>
                            ))
                        )
                    }
                </ul>
            </Transition>
        </div>
    )
}

export default Dropdown