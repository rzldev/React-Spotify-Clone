import _ from 'lodash';
import { useEffect, useState } from 'react';

const dots = _.range(0, 4);

function Loading(props) {
    const [activeDot, setActiveDot] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setActiveDot((state) => state >= dots[dots.length - 1] ? 0 : state + 1), 500);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <div className={props.className ? props.className : 'bg-gray-800 absolute inset-0 flex flex-column items-center'}>
            <div className="w-full flex gap-2 justify-center">
                {
                    dots.map(dot => (
                        <span
                            key={dot}
                            className={`h-4 w-4 rounded-full transition ease-in-out duration-300 transform 
                            ${dot === activeDot ? 'bg-green-500 scale-100' : 'bg-gray-500 scale-75'}`} />
                    ))
                }
            </div>
        </div>
    )
}

export default Loading