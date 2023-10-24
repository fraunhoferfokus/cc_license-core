"use client"
import { Autocomplete, AutocompleteRenderInputParams, Button, TextField } from '@mui/material';
import { useStore } from '../../zustand/store';
import { ReactNode, useEffect, useState } from 'react';
import TableComponent from '../components/Table/TableComponent';
import Select from 'react-select';
import { transformUserToData } from '../components/Table/UserGroupTable';

export default function Licenses() {
    const {
        licenseDefinitions,
        licenseAssignments,
        setSelectedMedia,
        myself,
        licensesLoading
    } = useStore(state => state)
    let org = myself?.personenkontexte[0].organisation
    let products: any[] = []
    let licenses: any[] = []
    const [mediumtrigger2, setMediumTrigger2] = useState(false)


    let [filterMap, setFilterMap] = useState<{
        lizenztyp: {
            label: string,
            value: string
        },
        verlag: string,
        medien_id: string,
        medium: string
    }>({
        lizenztyp: { label: 'Einzellizenz', value: 'Einzellizenz' },
        verlag: '',
        medien_id: '',
        medium: ''

    })

    licenseDefinitions?.forEach((grouped_liceses) => {
        let license = grouped_liceses[0]
        let product_id = license.target
        let metadata = license.metadata
        let max_nutzer = license.action![0].refinement.find((item) => item.uid === 'lizenzanzahl')?.rightOperand
        let medien_id = metadata.general.identifier
        let verlag = license.assignee
        let zugewiesen = licenseAssignments.filter((item) => item.target === product_id).length
        let verfügbar = licenseDefinitions.filter((item) => item[0].target === product_id).length - zugewiesen
        let medium = license.metadata.general.title.value

        // get the last slash after splitting 
        let lizenzcode = license.uid.split('/').pop()
        let lizenztyp = license.action![0].refinement.find((item) => item.uid === 'lizenztyp')?.rightOperand

        let cover = license.metadata.annotation[0].description.value


        let aggregate = {
            medien_id,
            medium,
            verlag,
            max_nutzer,
            zugewiesen,
            verfügbar,
            cover
        }

        if (!products.find((item) => item.product_id === product_id)) products.push(aggregate)
        if (!licenses.find((item) => item.medien_id === medien_id)) licenses.push({
            lizenz_id: license.uid,
            lizenzcode,
            medien_id,
            medium,
            verlag,
            lizenztyp,
            max_nutzer,
            zugewiesen,
            verfügbar,
        })

    })

    useEffect(() => {
        setMediumTrigger2(!mediumtrigger2)

    }, [filterMap])

    return (
        <>
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
                        {/* <div
                        className='mr-[10px]'
                    >
                        <TextField
                            placeholder="Beginn Zeitraum"
                            className="bg-white max-w-[700px]  w-[300px]"

                        >

                        </TextField>
                        <div
                            className='mt-[5px] pl-[5px] '
                        >
                            Beginn Zeitraum
                        </div>
                    </div>
                    <div
                        className='mr-[10px]'

                    >
                        <TextField
                            placeholder="Beginn Zeitraum"
                            className="bg-white max-w-[700px]  w-[300px]"

                        >

                        </TextField>
                        <div
                            className='mt-[5px] pl-[5px]'
                        >
                            Ende Zeitraum
                        </div>
                    </div> */}
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


                        <Select
                            className='h-[41px] max-w-[700px]  w-[300px]'
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




                        {/* <div
                        className='mr-[10px]'

                    >
                        <TextField
                            placeholder="Medium"
                            className="bg-white max-w-[700px]  w-[300px]"

                        >

                        </TextField>
                        <div
                            className='mt-[5px] pl-[5px]'
                        >
                            Beginn Zeitraum
                        </div>
                    </div> */}

                    </div>

                    <div
                        className='flex-1 flex flex-col bg-white mt-[20px] pt-[30px] pl-[30px] pr-[30px] rounded-[10px] overflow-hidden'
                    >

                        <TableComponent
                            data={licenses}
                            header={[
                                { label: 'Lizenz_id', id: 'lizenz_id', disabled: true },
                                { label: 'Lizenz-Code', id: 'lizenzcode' },
                                { label: 'Medien ID', id: 'medien_id' },
                                { label: 'Verlag', id: 'verlag' },
                                { label: 'Lizenztyp', id: 'lizenztyp' },
                                { label: 'Max Nutzer', id: 'lizenzanzahl' },
                                { label: 'Medium', id: 'medium' },
                                { label: 'Zugewiesen', id: 'zugewiesen' },

                                { label: 'Verfügbar', id: 'verfügbar' },

                            ]}
                            headerBackgroundColor={'white'}
                            trigger={mediumtrigger2}
                            setTrigger={setMediumTrigger2}
                            filterFunction={(entries: any) => {

                                if (filterMap.lizenztyp.value) {
                                    entries = entries.filter((item: any) => {
                                        return item.lizenztyp.toLowerCase().indexOf(filterMap.lizenztyp.value.toLowerCase()) > -1
                                    })
                                }

                                if (filterMap.verlag) {
                                    entries = entries.filter((item: any) => {
                                        return item.verlag.toLowerCase().indexOf(filterMap.verlag.toLowerCase()) > -1
                                    })
                                }

                                if (filterMap.medien_id) {
                                    entries = entries.filter((item: any) => {
                                        return item.medien_id.toLowerCase().indexOf(filterMap.medien_id.toLowerCase()) > -1
                                    })
                                }

                                if (filterMap.medium) {
                                    entries = entries.filter((item: any) => {
                                        return item.medium.toLowerCase().indexOf(filterMap.medium.toLowerCase()) > -1
                                    })
                                }

                                return entries
                            }}
                            isLoading={licensesLoading}
                            highlightOnHover={true}
                            pickedColor={'#EEF7FE'}
                            onChangeClickedRow={(identifier: string) => {
                                let license = licenses.find((item) => item.lizenz_id === identifier)
                                if (identifier) {
                                    setSelectedMedia(license.medien_id)
                                    // setSelectedLicenseId(identifier)
                                    // setView('media')
                                    // console.log('setting view')
                                }
                                // setSelectedLicenseId(identifier)
                            }}
                            // singleCheckBox={true}
                            identifier={'lizenz_id'}
                        />


                    </div>
                </div>


            </div>


        </>
    )

}