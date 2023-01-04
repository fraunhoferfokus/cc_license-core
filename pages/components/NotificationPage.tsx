import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStore } from "../../zustand/store";

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useEffect, useState } from "react";
import { style } from "@mui/system";


export default function NotificationPage() {
    const { licenseDefinitions, fetchLicenseDefinitions, fetchLicenseAssignments, users, fetchUsers, groups,
        licenseAssignments, notification, setNotification
    } = useStore(state => state)



    const productMap = {}

    const availableProductOptions = licenseDefinitions.flat(10).filter((license) => {
        const product_id = license.permissions![0].target!
        if (product_id in productMap) {
            return false
        }
        return true
    }).map((license) => {
        const product_id = license.permissions![0].target!
        const label = license.metadata.general.title.value
        return { label: label, value: product_id }
    })

    const licenseTypeOptions = [
        {
            label: 'Gruppenlizenz',
            value: 'Gruppenlizenz'
        },
        {
            label: 'Einzellizenz',
            value: 'Einzellizenz'
        },
        {
            label: 'Volumenlizenz',
            value: 'Volumenlizenz'
        }
    ]

    const [type, setType] = useState({ label: notification.license_type, value: notification.license_type })

    useEffect(() => {
        setType({ label: notification.license_type, value: notification.license_type })
    }, [notification])

    return (<>
        <Paper className="basis-[50%] p-[2%] overflow-scroll flex flex-col">
            <div className="flex-1">
                <div className='flex flex-row justify-center'>

                    <div className="flex-1 flex">
                        <div className="flex justify-center items-center w-[120px] break-all">
                            <b>
                                Produkt:
                            </b>
                        </div>

                        <div className="flex-1 flex justify-end">

                            <Autocomplete
                                options={availableProductOptions}
                                className='w-[100%] p-2 max-w-[250px]'
                                value={availableProductOptions.find((option) => option.value === notification.product_id)}
                                onChange={(event, value) => {
                                    setNotification({ ...notification, product_id: value?.value! })
                                }}
                                //@ts-ignore
                                renderInput={(params) => <TextField {...params} label="Wählen Sie ein Produkt aus" variant="outlined" />
                                }
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="flex justify-center items-center w-[120px] break-normal">
                            <b>
                                Lizenztyp:
                            </b>
                        </div>
                        <div className="flex-1 flex justify-end">

                            <Autocomplete
                                options={licenseTypeOptions}
                                className='w-[100%] p-2 max-w-[250px]'
                                value={type}
                                //@ts-ignore
                                renderInput={(params) => <TextField {...params} label="Wählen Sie den Lizentypen aus" variant="outlined" />
                                }
                            />
                        </div>

                    </div>

                </div>



                <div className="flex items-center gap-2">

                    <div className="flex-1 flex justify-center flex-row items-center text-center mt-[20px]">


                        <div className="mb-[10px] mt-[5px] mr-[10px] w-[120px] break-all">
                            <b>
                                Lizenzanzahl:

                            </b>

                        </div>
                        <div className="flex-1 flex justify-end">
                            <TextField
                                className='w-[100px] text-center'
                                type={'number'}
                                value={notification.count}
                                onChange={(e) => {
                                    const intVal = parseInt(e.target.value)
                                    if (intVal > 0) setNotification({ ...notification, count: intVal })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center flex-row items-center text-center mt-[20px]">
                        <div className="mb-[10px] mt-[5px] mr-[10px] w-[120px] break-all">
                            <b
                            >
                                Gültigskeitsdauer (in Tagen):

                            </b>

                        </div>

                        <div className="flex-1 flex justify-end">
                            <TextField
                                onChange={(e) => {
                                    const intVal = parseInt(e.target.value)
                                    if (intVal > 0) {

                                        setNotification({ ...notification, elapsed_time: intVal })
                                    }
                                }}
                                className='w-[100px] text-center'
                                type={'number'}
                                value={notification.elapsed_time}
                            />
                        </div>

                    </div>

                </div>
                <LocalizationProvider dateAdapter={AdapterMoment} >

                    <div className="text-center m-[20px]"><b>Aktivierungszeitraum:</b></div>
                    <div className='flex flex-row p-2 gap-2 items-center justify-center'>


                        Von: <DatePicker
                            renderInput={(props) => {
                                const defined = notification.start_date !== null && notification.end_date !== null
                                return <TextField
                                    style={{
                                        border: defined && notification.start_date! > notification.end_date! ? '1px solid red' : ''

                                    }}

                                    {...props}
                                />
                            }}
                            onChange={(date) =>

                                setNotification({ ...notification, start_date: date })

                            }
                            value={notification.start_date}
                            disablePast={true}

                        />

                        Bis: <DatePicker
                            renderInput={(props) => {
                                const defined = notification.start_date !== null && notification.end_date !== null
                                return <TextField
                                    style={{
                                        border: defined && notification.start_date! > notification.end_date! ? '1px solid red' : ''

                                    }}
                                    {...props}
                                />
                            }}
                            onChange={(date) => {
                                setNotification({ ...notification, end_date: date })
                            }}
                            value={notification.end_date}

                        />




                    </div>
                </LocalizationProvider>
            </div>

            <div className="flex justify-end">
                <Button variant="contained"

                    disabled={(() => {
                        // @ts-ignore
                        const isNull = Object.keys(notification).some((key) => notification[key] === null)
                        if (null) return true
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        if (notification.start_date! < today) return true
                        if (notification.start_date! > notification.end_date!) return true
                        if (notification.count! <= 0) return true
                        if (notification.elapsed_time! <= 0) return true
                    })()}
                >
                    Anfrage senden
                </Button>

            </div>
        </Paper>
        <Paper className="basis-[50%] p-[2%] flex flex-row justify-center items-center overflow-scroll">
        </Paper>
    </>)
}