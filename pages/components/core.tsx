import { Divider, Link, MenuItem, MenuList, Paper } from "@mui/material"
import { useState } from "react"


export default function Core({ children, props }: { children?: any, props?: { user: any } }) {

    const [users, setUsers] = useState([])



    return (
        <div className={'w-[100%] h-[100%] flex bg-[#e7ebef]'}>
            <nav className='w-[20%] bg-white'>
                <Paper>
                    <MenuList>
                        <MenuItem>  <Link href='/lizenzImport'>
                            Lizenz Import
                        </Link></MenuItem>
                        <Divider></Divider>
                        <MenuItem

                        >
                            <Link href='/bedarfsmeldung'>
                                Bedarfsmeldung
                            </Link>
                        </MenuItem>
                        <Divider></Divider>
                        <MenuItem
                        >
                            <Link href='/lizenzZuweisung'>
                                Lizenzzuweisung
                            </Link>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </nav>
            <div className='p-4'>
            </div>
            <div>
                {children}

            </div>
        </div>
    )
}