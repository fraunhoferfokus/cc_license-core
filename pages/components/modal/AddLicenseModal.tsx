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
import CloseIcon from '@mui/icons-material/Close';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Button, MenuItem, Paper, Select, TextField, Tooltip } from "@mui/material";
import axios from 'axios';
import { useState } from "react";
import CustomModal from "./CustomModal";
import { useStore } from '../../../zustand/store';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function AddLicenseModal({ open, setOpen }: any) {

    const { fetchLicenseDefinitionsV2 } = useStore(state => state)

    const [isLoading, setIsLoading] = useState(false)


    const [users, setUsers] = useState([])

    const [element, setElement] = useState({
        downloadID: "",
        isValidDownloadID: true,
        isDownloadID: true,
    })

    const [licenseDefinitions, setLicenseDefinitions] = useState([])

    return (
        <>
            <CustomModal open={open} setOpen={setOpen}>
                <Paper className=" bg-white invisible ">
                </Paper>
                <Paper className=" bg-white h-full flex flex-col min-w-[850px]">
                    <div className="flex p-2 h-[79px] items-center">

                        <label className="text-center flex-1 font-[700]">
                            Lizenz importieren
                        </label>
                        <CloseIcon
                            onClick={() => setOpen(false)}
                            className="cursor-pointer text-[#D9D9D9] text-[40px] stroke-[#D9D9D9]"
                            sx={{
                                fontSize: 40
                            }}

                        >
                        </CloseIcon>
                    </div>


                    <div className="mt-[10px] pl-[10%] pr-[10%] pb-[5%] flex gap-2 flex-col flex-1 min-h-0">
                        {
                            !element.isDownloadID ?

                                <textarea className="flex-1 p-2"

                                >
                                    2
                                </textarea> :
                                <div className="flex">
                                    <TextField
                                        id="filled-start-adornmen"
                                        value={element.downloadID}
                                        label="Abholnummer"

                                        variant="outlined"
                                        className="flex-1"
                                        error={
                                            !element.isValidDownloadID
                                        }
                                        helperText={
                                            !element.isValidDownloadID &&
                                            "Not valid DownloadID..."
                                        }
                                        onChange={(e) => {
                                            setElement((el) => ({ ...el, downloadID: e.target.value }))

                                        }}
                                    />
                                </div>


                        }

                        <Paper className="
                            flex-1
                            overflow-scroll
                        ">
                            <div
                                className="
                                    gap-2
                                    h-full

                                "

                            >
                                {
                                    isLoading && Array(10).fill(0).map((el, index) => {
                                        return <div className="animate-pulse bg-gray-300 rounded">
                                            <div
                                                className='h-[241px] flex pt-[20px] pl-[10px] pr-[10px]'
                                            >
                                                <div
                                                    className='h-full w-[250px] mr-[25px] relative bg-[#E0E0E0]'
                                                >
                                                    <img
                                                        className='w-full'
                                                    >
                                                    </img>
                                                </div>

                                                <div
                                                    className='p-[25px] w-full'
                                                >

                                                    <div
                                                        className='mt-[10px] w-full bg-[#E0E0E0] h-[40px] rounded'

                                                    >

                                                    </div>
                                                    <div
                                                        className='mt-[10px] w-full bg-[#E0E0E0] h-[40px] rounded mb-[50px]'

                                                    >

                                                    </div>

                                                    <div
                                                        className='mt-[10px] w-full bg-[#E0E0E0] h-[40px] rounded'

                                                    >

                                                    </div>


                                                    <div
                                                        className='mt-[10px] w-full bg-[#E0E0E0] h-[40px] rounded'

                                                    >

                                                    </div>
                                                    <div
                                                        className='mt-[10px] w-full bg-[#E0E0E0] h-[40px] rounded'

                                                    >

                                                    </div>

                                                </div>
                                            </div>


                                        </div>

                                    })
                                }




                                {licenseDefinitions.map((el: any, index) => {
                                    let element = el[0]
                                    let metadata = element.metadata
                                    let image = metadata?.annotation[1]?.description?.value
                                    let title = metadata?.general?.title?.value
                                    let data = element?.data
                                    let product_id = data?.product_id
                                    let lizenz_geber = data?.lizenzgeber
                                    let lizenz_typ = data?.lizenztyp
                                    let description = metadata?.general?.description[0]?.value

                                    return (
                                        <>
                                            <div
                                                className='h-[341px] flex pt-[20px] pl-[10px] pr-[10px]'
                                            >
                                                <div
                                                    className='h-full w-[250px] mr-[25px] relative'
                                                >
                                                    <img
                                                        className='w-full'
                                                        src={image}
                                                    >
                                                    </img>
                                                    {
                                                        element.status === 409 &&
                                                        <div
                                                            className='absolute top-[200px] right-[10px] cursor-pointer'
                                                        >
                                                            <Tooltip
                                                                title="Diese Medium wurde bereits importiert!"
                                                                placement="top"
                                                            >

                                                                <HighlightOffIcon
                                                                    className='text-[red] text-[60px] stroke-[red]'
                                                                >

                                                                </HighlightOffIcon>
                                                            </Tooltip>
                                                        </div>
                                                    }

                                                </div>
                                                <div
                                                    className='p-[25px]'
                                                >
                                                    <label
                                                        className='font-bold text-[24px]'
                                                    >
                                                        {title}
                                                    </label>

                                                    <div
                                                        className='text-[20px] text-[#585867]'
                                                    >
                                                        <div
                                                            className='mt-[10px]'

                                                        >
                                                            {description}
                                                        </div>


                                                        <div
                                                            className='mt-[15px]'
                                                        >
                                                            Produkt-ID: {product_id}
                                                        </div>
                                                        <div>
                                                            Lizenzgeber: {lizenz_geber}
                                                        </div>
                                                        <div>
                                                            Lizenztyp: {lizenz_typ}
                                                        </div>
                                                    </div>


                                                </div>


                                            </div>

                                        </>



                                    )
                                })}


                            </div>

                        </Paper>

                        <div className="flex justify-end">

                            <Button variant="contained"
                                disabled={!element.downloadID}
                                onClick={() => {
                                    setIsLoading(true)

                                    setElement({
                                        ...element,
                                        downloadID: "",
                                    })

                                    // import via downloadID
                                    if (element.isDownloadID) {
                                        axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/license_manager/licenseInformations/import2/${element.downloadID}`,
                                            {
                                                withCredentials: true,
                                            }

                                        )
                                            .then(async (resp) => {
                                                setElement((el) => ({ ...el, isValidDownloadID: true }))

                                                let data = resp.data
                                                const volumeLizenzen = data.filter((el: any) => el.data.lizenztyp === "Volumenlizenz")
                                                data = data.filter((el: any) => el.data.lizenztyp !== "Volumenlizenz").map((el: any) => [el])

                                                const volumenMapper: any = {}

                                                for (const vol of volumeLizenzen) {
                                                    if (!volumenMapper[vol.data.kaufreferenz + vol.data.product_id]) {
                                                        volumenMapper[vol.data.kaufreferenz + vol.data.product_id] = [
                                                            vol
                                                        ]
                                                    } else {
                                                        volumenMapper[vol.data.kaufreferenz + vol.data.product_id].push(vol)
                                                    }
                                                }

                                                for (const key in volumenMapper) {
                                                    data.push(volumenMapper[key])
                                                }

                                                const product_ids = []

                                                for (const el of data) {
                                                    const ele = el[0].data
                                                    const product_id = ele.product_id
                                                    product_ids.push({ id: product_id })
                                                }

                                                if (data.length > 0) {
                                                    const resp2 = await axios.post(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/metadata_manager/getMetadataById`,
                                                        product_ids
                                                        ,
                                                        {
                                                            withCredentials: true,
                                                        }
                                                    )

                                                    for (let i = 0; i < resp2.data.length; i++) {
                                                        let ele = data[i][0]
                                                        let metadata = resp2.data[i].data.lom
                                                        ele.metadata = metadata
                                                    }
                                                }

                                                setLicenseDefinitions(data)
                                                fetchLicenseDefinitionsV2()
                                                setIsLoading(false)
                                            })
                                            .catch((e) => {
                                                setElement((el) => ({ ...el, isValidDownloadID: false }))
                                            })

                                    }


                                }
                                }


                            >Lizenz IMPORTIEREN</Button>
                        </div>



                    </div>



                </Paper>


            </CustomModal>
        </>
    )
}