import { Transition } from "@headlessui/react";
import React, { Fragment, useContext } from "react";
import { PlayerContext } from "../../context/player-context";
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import ComputerRoundedIcon from '@mui/icons-material/ComputerRounded';

const DevicePopup = React.memo((props) => {
    const { devices, deviceId, setDevice } = useContext(PlayerContext);

    return (
        <Transition
            as={Fragment}
            show={props.show}
            enterFrom="opacity-0 translate-y-8"
            enterTo="opacity-100 translate-y-0"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-8"
        >
            <div className={`${props.className} bg-gray-292929 z-10 py-2 rounded-lg transition duration-300 ease-in-out transform flex flex-col items-center`}>
                <h2 className="text-lg font-bold">Connect to a device</h2>
                <DevicesOtherIcon className="my-2" style={{ fontSize: '100px' }} />
                {
                    devices.map(device => (
                        <div 
                            key={device.id}
                            className={`w-full px-6 py-2 flex gap-2 items-center ${(device.id === deviceId) && 'spotify-green'} cursor-pointer transition duration-200 ease hover:bg-white hover:bg-opacity-10`}
                            onClick={() => setDevice(device.id)}
                            >
                            <div className={`h-10 w-10 flex items-center ${(device.id !== deviceId) && 'text-gray-300'}`}>
                                <ComputerRoundedIcon className="transform scale-150" />
                            </div>
                            <div key={device.id}>
                                <label className="text-sm font-bold">{device.name}</label>
                                <p className={`text-xs ${(device.id !== deviceId) && 'text-gray-300'}`}>{device.id === deviceId ? 'Connected Device' : 'Spotify Connect'}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Transition>
    )
})

export default DevicePopup;