/* -----------------------------------------------------------------------------
 *  Copyright (c) 2023, Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.   
 *
 *  No Patent Rights, Trademark Rights and/or other Intellectual Property 
 *  Rights other than the rights under this license are granted. 
 *  All other rights reserved.
 *
 *  For any other rights, a separate agreement needs to be closed.
 * 
 *  For more information please contact:   
 *  Fraunhofer FOKUS
 *  Kaiserin-Augusta-Allee 31
 *  10589 Berlin, Germany 
 *  https://www.fokus.fraunhofer.de/go/fame
 *  famecontact@fokus.fraunhofer.de
 * -----------------------------------------------------------------------------
 */
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