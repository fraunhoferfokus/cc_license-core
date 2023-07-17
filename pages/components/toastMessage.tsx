import { useEffect, useState } from "react";
import { useStore } from "../../zustand/store";
import { Alert } from "@mui/material";





export function ToastMessage() {
    const { toastProps, setToastProps } = useStore((state) => state);
    const [show, setShow] = useState(false);


    useEffect(() => {
        if (toastProps.message) {
            setShow(true);
            setTimeout(() => {
                setToastProps('', 'success');
                setShow(false);
            }, toastProps.duration);
        }
    }, [toastProps.message])


   

    return (
        <>
            {/* <div
                className="w-full h-full absolute top-0 left-0 z-50"
            >
                <div
                    className="relative w-full h-full"
                > */}
            <div className="absolute top-10 right-5 z-50">
                {show &&
                    <Alert
                        className=""
                        severity={`${toastProps.severity}`}>{toastProps.message}
                    </Alert>

                }
            </div>

            {/* </div>
            </div> */}
        </>
    )
}