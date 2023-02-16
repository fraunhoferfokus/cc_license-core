import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Paper, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStore } from "../../zustand/store";

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useEffect, useState } from "react";
import { style } from "@mui/system";
import { LicenseDefinitionModel } from "license_manager";
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { toBILO } from "../../helper/helper";
export default function NotificationPage() {
    const { licenseDefinitions, fetchLicenseDefinitions, fetchLicenseAssignments, users, fetchUsersAndGroups: fetchUsers, groups,
        licenseAssignments, notification, setNotification, fetchNotifications, createNotification, notifications, deleteNotification
    } = useStore(state => state)

    useEffect(() => {
        fetchNotifications()

    }, [])

    const [dialogBoxProperties, setDialogBoxProperties] = useState<{
        open: boolean,
        title: string,
        text: any,
        disableFooter: boolean,
        callback: () => void
    }>({
        open: false,
        text: '',
        title: '',
        disableFooter: false,
        callback: () => { }
    })


    const [modalProperties, setModalProperties] = useState<{ callback: () => void, open: boolean, id: any, ele: LicenseDefinitionModel | null, metadata: any }>({
        callback: () => { },
        open: false,
        id: '',
        ele: null,
        metadata: null
    })


    const productMap: any = {}
    const availabeProducts = licenseDefinitions.flat(10).filter((license) => {
        const product_id = license.permissions![0].target!
        if (product_id in productMap) {
            return false
        }
        productMap[product_id] = true
        return true
    })
    const availableProductOptions = availabeProducts.map((license) => {
        const product_id = license.permissions![0].target!
        const label = license?.metadata?.general?.title?.value
        return { label: label, value: product_id }
    })

    console.log({ availableProductOptions })

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

        if ((notification.count !== 1 && notification.license_type === 'Einzellizenz') || notification.count === 0) {
            setNotification({ ...notification, count: 1 })
        }

    }, [notification])

    return (<>
        <Paper className="basis-[50%] overflow-scroll flex flex-col">
            <div className='flex flex-col justify-center flex-1 gap-2'>



                <div className="flex justify-center gap-2">
                    <Autocomplete
                        options={availableProductOptions}
                        className='w-[100%] max-w-[250px]'
                        value={availableProductOptions.find((option) => option.value === notification.product_id)}
                        onChange={(event, value) => {
                            setNotification({ ...notification, product_id: value?.value! })
                        }}
                        //@ts-ignore
                        renderInput={(params) => <TextField {...params} label="Wählen Sie ein Produkt aus" variant="outlined" />
                        }
                    />



                    <Autocomplete
                        options={licenseTypeOptions}
                        className='w-[100%] max-w-[250px]'
                        value={type}
                        onChange={(event, value) => {
                            if (value) setNotification({ ...notification, license_type: value?.value! })
                        }}
                        //@ts-ignore
                        renderInput={(params) => <TextField {...params} label="Wählen Sie den Lizentypen aus" variant="outlined" />
                        }
                    />
                </div>



                <div className="flex justify-center gap-2">

                    <div className="basis-[50%] flex flex-row justify-end">
                        <div className="w-[135px] flex justify-start items-center ">
                            <label>
                                Anzahl:

                            </label>
                        </div>

                        <TextField
                            className='w-[100px] text-center'
                            type={'number'}
                            value={notification.count}

                            disabled={notification.license_type === 'Einzellizenz'}

                            onChange={(e) => {
                                const intVal = parseInt(e.target.value)
                                if (intVal > 0) setNotification({ ...notification, count: intVal })
                            }}
                        />
                    </div>


                    <div className="basis-[50%] flex flex-row justify-start gap-1">
                        <div className="w-[135px] flex justify-start items-center break-all">
                            <label>
                                Gültigskeitsdauer

                            </label>
                            <label>
                                :
                            </label>
                        </div>


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

                <div className="flex justify-center gap-2">
                    <LocalizationProvider dateAdapter={AdapterMoment} >


                        <div className="flex justify-center items-center">
                            <label>
                                Von:
                            </label>

                        </div>

                        <DatePicker
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
                        <div className="flex justify-center items-center">
                            <label>
                                Bis:
                            </label>

                        </div>

                        <DatePicker
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




                    </LocalizationProvider>
                </div>

            </div>

            <div className="flex justify-end p-2">
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

                    onClick={() => {
                        createNotification(notification)
                        setNotification(
                            {
                                product_id: null,
                                license_type: null,
                                start_date: null,
                                end_date: null,
                                elapsed_time: null,
                                count: null
                            }
                        )

                    }}
                >
                    Anfrage senden
                </Button>

            </div>
        </Paper>
        <Paper className="basis-[50%] p-[2%] flex flex-col items-center overflow-scroll gap-2">
            {notifications?.map((notification: LicenseDefinitionModel) => {
                const permissions = notification.permissions
                const found = availabeProducts.find((licenseDefinition) => {
                    return permissions![0].target === licenseDefinition.permissions![0]!.target
                })

                const title = found?.metadata.general?.title?.value

                return <Paper className="w-full p-2 h-[50px] flex" variant="outlined">

                    <b className="flex-1">
                        {title}
                    </b>
                    <div>

                        <InfoIcon
                            style={{
                                cursor: 'pointer',
                                color: '#1565C0'
                            }}
                            onClick={() => {
                                setModalProperties((props) => {
                                    return { ...props, open: true, metadata: found?.metadata, ele: notification }
                                })

                            }}
                        >

                        </InfoIcon>
                        <CancelIcon
                            style={{
                                cursor: 'pointer',
                                color: 'red'
                            }}
                            onClick={
                                () => {
                                    setDialogBoxProperties((props) => ({
                                        ...props, open: true, title: 'Lizenzanfrage löschen', disableFooter: false,
                                        text: 'Möchten Sie die Lizenzanfrage wirklich löschen?',
                                        callback: () => {
                                            deleteNotification(notification.policyid)
                                        }
                                    }

                                    )

                                    )

                                }

                            }
                        >

                        </CancelIcon>

                    </div>
                </Paper>

            })}
        </Paper>

        <Dialog
            open={dialogBoxProperties.open}
            onClose={() => {
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogBoxProperties.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogBoxProperties.text}
                </DialogContentText>
            </DialogContent>

            {
                !dialogBoxProperties.disableFooter && <DialogActions>
                    <Button onClick={
                        () => {
                            dialogBoxProperties.callback()
                            setDialogBoxProperties((props) => ({ ...props, open: false, value: null }))

                        }
                    }>Zustimmen</Button>
                    <Button onClick={
                        () => {
                            setDialogBoxProperties((props) => ({ ...props, open: false, value: null }))
                        }
                    } autoFocus>
                        Abbrechen
                    </Button>
                </DialogActions>
            }

        </Dialog>



        <Dialog
            open={modalProperties.open}
            onClose={() => {
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Bedarfsmeldung für: <b>
                    {modalProperties?.metadata?.general?.title?.value}
                </b>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {(() => {
                        const constraints = modalProperties.ele?.permissions![0]!.constraints!
                        const gueltigkeitsbeginn = new Date(constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime' && constraint.operator === 'http://www.w3.org/ns/odrl/2/gteq')?.rightoperand!)
                        const gueltigkeitsende = new Date(constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime' && constraint.operator === 'http://www.w3.org/ns/odrl/2/lteq')?.rightoperand!)
                        const anzahl = constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/count')?.rightoperand!
                        const dauer = constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/elapsedTime')?.rightoperand!
                        const lizenzart = constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/purpose' && constraint.operator === 'http://www.w3.org/ns/odrl/2/eq')?.rightoperand

                        const img = modalProperties?.metadata?.annotation[1].description.value

                        return <>
                            <div>
                                Lizenzart: <b>{lizenzart}</b>
                            </div>
                            <div>
                                Gültigkeitsbeginn: <b>{gueltigkeitsbeginn.getDate()}-{gueltigkeitsbeginn.getMonth() + 1}-{gueltigkeitsbeginn.getFullYear()}</b>
                            </div>
                            <div>
                                Gültigsende: <b>{gueltigkeitsende.getDate()}-{gueltigkeitsende.getMonth() + 1}-{gueltigkeitsende.getFullYear()}</b>
                            </div>
                            <div>
                                {lizenzart !== 'Gruppenlizenz' ?

                                    <>
                                        Lizenzanzahl: <b>{anzahl}</b>

                                    </> :
                                    <>
                                        Maximal gleichzeitige Nutzer: <b>{anzahl}</b>

                                    </>

                                }
                            </div>
                            <div>
                                Lizenzdauer: <b>{dauer}</b>
                            </div>
                            <br>
                            </br>
                            <div
                                style={{
                                    margin: '0 auto',
                                    backgroundImage: `url(${img})`,
                                    width: '300px',
                                    height: '300px',
                                }}
                            >
                            </div>
                        </>
                    })()}
                </DialogContentText>
            </DialogContent>


            <DialogActions>
                <Button onClick={
                    () => {
                        setModalProperties((props) => ({ ...props, open: false, value: null }))
                    }
                } autoFocus>
                    Schließen
                </Button>
            </DialogActions>


        </Dialog>


    </>)
}