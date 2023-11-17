"use client"
import { Autocomplete, AutocompleteRenderInputParams, Button, TextField } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import TableComponent from '../components/Table/TableComponent';
import Select from 'react-select';
import { transformUserToData } from '../components/Table/UserGroupTable';
import { useStore } from '../../zustand/store';
import RootLayout from '../components/Rooutlayout';
import TableTransformer from '../../helper/table/TableItemConverter';
import { useRouter } from 'next/router';


export default function Licenses() {
    const {
        licenseDefinitions,
        licenseAssignments,
        setSelectedMedia,
        myself,
        licensesLoading,
        users,
    } = useStore(state => state)
    let org = myself?.personenkontexte[0].organisation
    let products: any[] = []
    let licenses: {
        userId: string | undefined;
        assignmentId: string;
        lizenzId: string | undefined;
        vorname: any;
        nachname: any;
        lizenzcode: string | undefined;
        medien_id: any;
        medium: any;
        verlag: string | undefined;
        lizenztyp: string | undefined;
        verfügbar: string;
    }[] = []
    const [mediumtrigger2, setMediumTrigger2] = useState(false)
    const router = useRouter()



    let [filterMap, setFilterMap] = useState<{
        lizenztyp: {
            label: string,
            value: string
        },
        verlag: string,
        medien_id: string,
        medium: string,
        vorname: string,
        nachname: string,
    }>({
        lizenztyp: { label: 'Einzellizenz', value: 'Einzellizenz' },
        verlag: '',
        medien_id: '',
        medium: '',
        vorname: '',
        nachname: '',

    })


    licenseAssignments.forEach((assignment) => {
        licenses.push(TableTransformer.transformToLicenseAssingmentRow(assignment, users, licenseDefinitions))
    })

    licenseDefinitions.forEach((grouped_license) => {
        for (const license of grouped_license) {
            let found = licenses.find((item) => item.lizenzId === license.uid)
            if (!found) {
                licenses.push({
                    ...TableTransformer.transformToLicenseRow(license, licenseAssignments, licenseDefinitions),
                    userId: undefined,
                    lizenzId: license.uid,
                    vorname: undefined,
                    nachname: undefined,
                    assignmentId: license.uid! + 'assignment',
                    verfügbar: 'Ja'
                })
            }
        }
    })


    console.log(licenses.length)


    useEffect(() => {
        setMediumTrigger2(!mediumtrigger2)

    }, [filterMap])

    return (
        <>
            <RootLayout>
                <div
                    className="h-full flex flex-col p-[10px] "

                >
                    <div
                        className="flex justify-between"
                    >
                        <label
                            className="text-[#404045] font-bold text-[28px]"
                        >
                            Lizenz Übersicht
                        </label>
                        <div>
                            <div
                                className="h-[35px] bg-[rgba(0,0,0,0.06)] h-[41px] flex items-center 
                        justify-center text-[16px] mb-[3px]"
                            >
                                <label

                                >
                                    {org?.name}
                                </label>
                            </div>
                            <div
                                className="text-[rgba(0,0,0,0.6)] text-[12px]"
                            >
                                Die Schule, für die eine Zuweisung erfolgt
                            </div>
                        </div>
                    </div>

                    <div
                        className='flex flex-col flex-1 mt-[10px] overflow-hidden'
                    >
                        <div
                            className='flex flex-wrap gap-[5px]'
                        >

                            <div
                                className='mr-[10px]'

                            >
                                <TextField
                                    placeholder="Vorname"
                                    className="bg-white max-w-[700px]  w-[300px]"
                                    onChange={(e) => {
                                        setFilterMap({
                                            ...filterMap,
                                            vorname: e.target.value
                                        })
                                    }}
                                >

                                </TextField>
                                <div
                                    className='mt-[5px] pl-[5px]'
                                >
                                    Vorname
                                </div>
                            </div>

                            <div
                                className='mr-[10px]'

                            >
                                <TextField
                                    placeholder="Nachname"
                                    className="bg-white max-w-[700px]  w-[300px]"
                                    onChange={(e) => {
                                        setFilterMap({
                                            ...filterMap,
                                            nachname: e.target.value
                                        })
                                    }}
                                >

                                </TextField>
                                <div
                                    className='mt-[5px] pl-[5px]'
                                >
                                    Nachname
                                </div>
                            </div>

                            <Select
                                className='h-[41px] max-w-[700px]  w-[300px] '
                                options={
                                    [
                                        { label: 'Einzellizenz', value: 'Einzellizenz' },
                                        { label: 'Volumenlizenz', value: 'Volumenlizenz' },
                                        { label: 'Gruppenlizenz', value: 'Gruppenlizenz' }
                                    ]
                                }
                                onChange={(value) => {
                                    setFilterMap({
                                        ...filterMap,
                                        lizenztyp: value as any
                                    })
                                }}
                                value={filterMap.lizenztyp}
                                // isMulti={true}
                                placeholder='Lizenztyp'
                                styles={{
                                    container: (provided) => ({ ...provided, width: 300, height: 55 }),
                                    control: (provided) => ({ ...provided, height: 55, minHeight: 55 }),

                                }}
                            />

                            <div
                                className='mr-[10px]'

                            >
                                <TextField
                                    placeholder="Verlag"
                                    className="bg-white max-w-[700px]  w-[300px]"
                                    onChange={(e) => {
                                        setFilterMap({
                                            ...filterMap,
                                            verlag: e.target.value
                                        })
                                    }}
                                >

                                </TextField>
                                <div
                                    className='mt-[5px] pl-[5px]'
                                >
                                    Verlag
                                </div>
                            </div>




                            <div
                                className='mr-[10px] '

                            >
                                <TextField
                                    placeholder="Medien ID"
                                    className="bg-white max-w-[700px]  w-[300px]"
                                    onChange={(e) => {
                                        setFilterMap({
                                            ...filterMap,
                                            medien_id: e.target.value
                                        })
                                    }}
                                >

                                </TextField>
                                <div
                                    className='mt-[5px] pl-[5px]'
                                >
                                    Medien ID
                                </div>
                            </div>



                            <div
                                className='mr-[10px]'

                            >
                                <TextField
                                    placeholder="Medium"
                                    className="bg-white max-w-[700px]  w-[300px]"
                                    onChange={(e) => {
                                        setFilterMap({
                                            ...filterMap,
                                            medium: e.target.value
                                        })
                                    }}
                                >

                                </TextField>
                                <div
                                    className='mt-[5px] pl-[5px]'
                                >
                                    Medium
                                </div>
                            </div>
                        </div>
                        <div
                            className='flex-1 flex flex-col bg-white mt-[20px] pt-[30px] pl-[30px] pr-[30px] rounded-[10px] overflow-hidden'
                        >

                            <TableComponent
                                data={licenses}
                                header={[
                                    { label: 'Verfugbar Ja/Nein', id: 'verfügbar' },
                                    { label: 'Vorname', id: 'vorname' },
                                    { label: 'Nachname', id: 'nachname' },
                                    { label: 'Lizenz_id', id: 'lizenz_id', disabled: true },
                                    { label: 'Lizenz-Code', id: 'lizenzcode' },
                                    { label: 'Medien ID', id: 'medien_id' },
                                    { label: 'Verlag', id: 'verlag' },
                                    { label: 'Lizenztyp', id: 'lizenztyp' },
                                    // { label: 'Max Nutzer', id: 'lizenzanzahl' },
                                    { label: 'Medium', id: 'medium' },
                                    // { label: 'Zugewiesen', id: 'zugewiesen' },
                                    // { label: 'Verfügbar', id: 'verfügbar' },

                                ]}
                                headerBackgroundColor={'white'}
                                trigger={mediumtrigger2}
                                setTrigger={setMediumTrigger2}
                                filterFunction={(entries: any) => {

                                    if (filterMap.lizenztyp.value) {
                                        entries = entries.filter((item: any) => {
                                            return item.lizenztyp?.toLowerCase().indexOf(filterMap.lizenztyp.value.toLowerCase()) > -1
                                        })
                                    }

                                    if (filterMap.verlag) {
                                        entries = entries.filter((item: any) => {
                                            return item.verlag?.toLowerCase()?.indexOf(filterMap.verlag.toLowerCase()) > -1
                                        })
                                    }

                                    if (filterMap.medien_id) {
                                        entries = entries.filter((item: any) => {
                                            return item.medien_id?.toLowerCase()?.indexOf(filterMap.medien_id.toLowerCase()) > -1
                                        })
                                    }

                                    if (filterMap.medium) {
                                        entries = entries.filter((item: any) => {
                                            return item.medium?.toLowerCase()?.indexOf(filterMap.medium.toLowerCase()) > -1
                                        })
                                    }

                                    if (filterMap.vorname) {
                                        entries = entries.filter((item: any) => {
                                            return item.vorname?.toLowerCase()?.indexOf(filterMap.vorname.toLowerCase()) > -1
                                        })
                                    }

                                    if (filterMap.nachname) {
                                        entries = entries.filter((item: any) => {
                                            return item.nachname?.toLowerCase()?.indexOf(filterMap.nachname.toLowerCase()) > -1
                                        })
                                    }


                                    return entries
                                }}
                                isLoading={licensesLoading}
                                highlightOnHover={true}
                                pickedColor={'#EEF7FE'}
                                onChangeClickedRow={(identifier: string) => {
                                    let license = licenses.find((item) => item.assignmentId === identifier)
                                    if (identifier) {

                                        router.push(`/medien/${license?.medien_id}/${encodeURIComponent(license?.lizenzId as string)}`)

                                        // setSelectedMedia(license.medien_id)
                                        // setSelectedLicenseId(identifier)
                                        // setView('media')
                                        // console.log('setting view')
                                    }
                                    // setSelectedLicenseId(identifier)
                                }}
                                // singleCheckBox={true}
                                identifier={'assignmentId'}
                            />


                        </div>
                    </div>


                </div>
            </RootLayout>
        </>
    )

}