import CloseIcon from '@mui/icons-material/Close';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Button, MenuItem, Paper, Select, TextField, Tooltip } from "@mui/material";
import axios from 'axios';
import { useState } from "react";
import CustomModal from "./CustomModal";
import { useStore } from "../../../zustand/store";
export default function AddLicenseModal({ open, setOpen }: any) {

    const { fetchLicenseDefinitionsV2 } = useStore(state => state)

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
                                                    className='h-full w-[250px] mr-[25px]'
                                                >
                                                    <img
                                                        className='w-full'
                                                        src={image}
                                                    >
                                                    </img>
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
                                onClick={() => {

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
                                            })
                                            .catch((e) => {
                                                setElement((el) => ({ ...el, isValidDownloadID: false }))
                                            })

                                    }
                                }}


                            >Lizenz IMPORTIEREN</Button>
                        </div>



                    </div>



                </Paper>


            </CustomModal>
        </>
    )
}