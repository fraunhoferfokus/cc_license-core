import CloseIcon from '@mui/icons-material/Close';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Button, MenuItem, Paper, Select, TextField, Tooltip } from "@mui/material";
import axios from 'axios';
import { useState } from "react";
import CustomModal from "./CustomModal";
import { useStore } from "../zustand/store";
export default function AddLicenseModal({ open, setOpen }: any) {

    const { fetchLicenseDefinitions } = useStore(state => state)

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
                <Paper className=" bg-white invisible basis-[40%]">
                </Paper>
                <Paper className=" bg-white basis-[60%] h-full flex flex-col">
                    <div className="flex p-2">

                        <h1 className="text-center flex-1">
                            Lizenz hinzufügen
                        </h1>
                        <CloseIcon
                            onClick={() => setOpen(false)}
                            className="cursor-pointer text-[#4671C4] text-[40px] stroke-[#4671C4] stroke-[3px]"
                        >
                        </CloseIcon>
                    </div>


                    <div className="mt-[10px] pl-[10%] pr-[10%] pb-[5%] flex gap-2 flex-col flex-1 min-h-0">
                        <Select className="text-center"
                            defaultValue={"1"}
                            onChange={(e) => {
                                e.target.value === "1" ? setElement((el) => ({ ...el, isDownloadID: true })) : setElement((el) => ({ ...el, isDownloadID: false }))


                            }}
                        >
                            <MenuItem value="1">Import über DownloadID</MenuItem>
                            <MenuItem value="2">Import über Datei Upload (ODRL) </MenuItem>
                        </Select>

                        {
                            !element.isDownloadID ?

                                <textarea className="flex-1 p-2"

                                >
                                    2
                                </textarea> :
                                <div className="flex">
                                    <TextField id="outlined-basic" placeholder="Enter DownloadID ..." variant="outlined"
                                        className="flex-1"
                                        error={
                                            !element.isValidDownloadID
                                        }
                                        helperText={
                                            !element.isValidDownloadID &&
                                            "Not valid DownloadID..."
                                        }
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            setElement((el) => ({ ...el, downloadID: e.target.value }))

                                        }}
                                    />
                                </div>


                        }

                        <Paper className="overflow-scroll
                            flex-1
                           

                        ">
                            <div
                                className="
                                    gap-2
                                    h-full
                                 grid grid-cols-[repeat(auto-fill,100px)]
                                grid-rows-[repeat(auto-fill,100px)]"

                            >
                                {licenseDefinitions.map((el: any, index) => {
                                    let element = el[0]
                                    let metadata = element.metadata
                                    let image = metadata.annotation[1].description.value
                                    console.log(image)
                                    return (

                                        <Tooltip title={(() => {

                                            return (<>
                                                {element.status !== 204 &&
                                                    <h1 className="text-[red]">Already Imported!</h1>

                                                }
                                                <h1>{metadata.general.title.value}</h1>
                                                <br></br>
                                                <h1>{metadata.general.description.value}</h1>
                                            </>)
                                        })()
                                        }>

                                            <Paper
                                                sx={
                                                    {
                                                        backgroundColor: 'white',
                                                        borderRadius: '10px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: '100px',
                                                        height: '100px',
                                                        border: '1px solid #e7ebef',
                                                        position: 'relative',
                                                        backgroundImage: `url(${metadata.annotation[1].description.value})`,
                                                    }
                                                }
                                            >

                                                {el[0].status !== 204 ?
                                                    <CloseIcon
                                                        className="absolute bottom-0 right-0 text-[red] text-3xl  stroke-[red] stroke-[3px]"
                                                    >
                                                    </CloseIcon>
                                                    :
                                                    <DoneOutlineIcon
                                                        className="absolute bottom-0 right-0 text-[green] text-3xl"
                                                    ></DoneOutlineIcon>
                                                }
                                            </Paper>
                                        </Tooltip>

                                    )
                                })}


                            </div>

                        </Paper>

                        <div className="flex justify-end">

                            <Button variant="contained"
                                onClick={() => {

                                    // import via downloadID
                                    if (element.isDownloadID) {
                                        axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/license_manager/licenseInformations/import/${element.downloadID}`)
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

                                                for (const el of data) {
                                                    const resp = await axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/metadata_manager/${el[0].data.product_id}`)
                                                    el[0].metadata = resp.data.data.lom
                                                }
                                                setLicenseDefinitions(data)
                                                fetchLicenseDefinitions()
                                            })
                                            .catch((e) => {
                                                setElement((el) => ({ ...el, isValidDownloadID: false }))
                                            })

                                    }
                                }}


                            >Importieren</Button>
                        </div>



                    </div>



                </Paper>


            </CustomModal>
        </>
    )
}