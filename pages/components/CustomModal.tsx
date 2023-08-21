import { Box, Divider, Link, MenuItem, MenuList, Modal, Paper, Typography } from "@mui/material"
import { useRef, useState } from "react"

export default function CustomModal({ open, setOpen, children }: any) {

    const [users, setUsers] = useState([])

    const ref = useRef(null)

    return (
        <div className="absolute w-full h-full bg-black top-0 left-0 bg-opacity-50 z-[100] 
        flex items-center justify-center
        "
            style={{ display: open ? 'block' : 'none' }}


        >
            <div className=" flex p-10 h-full 
                    flex items-center justify-center
            "

                onClick={(e) => {
                    if (e.target === e.currentTarget) setOpen(false)


                }}
            >
                {children}

            </div>
        </div>
    )
}