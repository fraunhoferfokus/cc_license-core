import { Autocomplete, AutocompleteRenderInputParams, Button, TextField } from '@mui/material';
import { useStore } from '../../zustand/store';
import { ReactNode, useEffect, useState } from 'react';
import TableComponent from './Table/TableComponent';
import Select from 'react-select';
import { transformUserToData } from './Table/UserGroupTable';
import { useParams } from "react-router-dom";


export default function Medien({ setLicenseModal }: {
    setLicenseModal: any,
}) {

    const [org, fetchOrg] = useStore(state => [state.org, state.fetchOrg])

    // let [selectedLicenseId, setSelectedLicenseId] = useState<any>(null)


    const { id } = useParams<any>();


    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        licenseAssignments,
        users,
        fetchUsersAndGroups,
        fetchLicenseDefinitionsV2,
        deleteLicenseAssignment,
        setToastProps,
        selectedLicenseId,
        setSelectedLicenseId,
        selectedMedia,
        setSelectedMedia,
    } = useStore(state => state)
    let products: any[] = []
    let licenses: any[] = []

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

    // let [selectedMedia, setSelectedMedia] = useState<any>('')
    let [medium_value, set_medium_value] = useState('')
    const [mediumtrigger, setMediumTrigger] = useState(false)
    const [mediumtrigger2, setMediumTrigger2] = useState(false)


    let product = products.find((item) => item.medien_id === selectedMedia)
    let [licenseTypes, setLicenseTypes] = useState<any[]>([])


    let selectedLicense = licenses.find((item) => item.lizenz_id === selectedLicenseId)


    useEffect(() => {
        fetchLicenseDefinitionsV2()
        fetchUsersAndGroups()
        fetchLicenseAssignments()


    }, [])



    let userLicenseAssignments = licenseAssignments.filter((assignment) => assignment.inheritFrom === selectedLicense?.lizenz_id)
    let filteredUsers = users.filter((user) => userLicenseAssignments.find((assignment) => assignment.assignee === user.id))


    const [selectedUserIds, setSelectedUsers] = useState<any[]>([])

    useEffect(() => {
        if (licenseTypes.length > 0) setMediumTrigger2(!mediumtrigger2)
    }, [licenseTypes])



    return (
        <div className='h-full flex flex-col'>
            {
                selectedMedia === '' &&
                <>
                    <div
                        className="flex justify-between"
                    >
                        <label
                            className="text-[#404045] font-bold text-[28px]"
                        >
                            Medien
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
                        className='h-full flex flex-col mt-[18px]'
                    >



                        <div
                            className="w-full bg-white flex-1 flex"
                        >
                            <TableComponent
                                data={products.length > 0 ? products : []}
                                header={[
                                    { label: 'Medien-ID', id: 'medien_id' },
                                    { label: 'Medium', id: 'medium' },
                                    { label: 'Arbeitsgruppe', id: 'verlag' },
                                    { label: 'Klasse', id: 'max_nutzer' },
                                    { label: 'Zugewiesen', id: 'zugewiesen' },
                                    { label: 'Verfügbar', id: 'verfügbar' }

                                ]}
                                headerBackgroundColor={'white'}
                                highlightOnHover={true}
                                onChangeClickedRow={(identifier: string) => {
                                    console.log({ identifier })
                                    if (identifier) setSelectedMedia(identifier)

                                }}
                                checkbox={false}
                                singleCheckBox={true}
                                identifier={'medien_id'}
                                filterFunction={(data: any[]) => {

                                    if (medium_value === '') return data

                                    return data.filter((item) => {
                                        for (let key in item) {
                                            // check if item[key] is string
                                            if (typeof item[key] === 'string') {
                                                if (item[key].toLowerCase().includes(medium_value.toLowerCase())) {
                                                    return true
                                                }
                                            }
                                        }

                                    })

                                }}
                                trigger={mediumtrigger}
                                setTrigger={setMediumTrigger}
                            />
                        </div>
                    </div>
                </>
            }

            {
                selectedMedia !== '' &&

                <>



                    <div className='flex'>

                        <img
                            className='cursor-pointer bg-[#585867] rounded-[40%] mr-[20px] self-start h-[30px] w-[30px]'
                            src='/previous.svg'
                            onClick={() => {
                                setSelectedMedia('')

                            }}
                        />

                        <div
                            className='flex-1'
                        >
                            <div>
                                <label
                                    className="text-[#404045] font-bold text-[28px]"
                                >
                                    Medium: {product?.medium?.split(' ')[0]}

                                </label>
                            </div>

                            <div
                                className='justify-end mb-[27px] mt-[29px] flex'
                            >

                                <Select
                                    className='h-[41px] '
                                    options={
                                        [
                                            { label: 'Einzellizenz', value: 'Einzellizenz' },
                                            { label: 'Volumenlizenz', value: 'Volumenlizenz' },
                                            { label: 'Gruppenlizenz', value: 'Gruppenlizenz' }
                                        ]
                                    }
                                    onChange={(value) => {
                                        setLicenseTypes(value as any)
                                    }}
                                    value={licenseTypes}
                                    isMulti={true}
                                    placeholder='Lizenztyp'
                                    styles={{
                                        container: (provided) => ({ ...provided, width: 440 }),


                                    }}
                                />

                            </div>

                            <div
                                className='h-[300px] w-full flex flex-wrap'
                            >
                                <div
                                    className='h-full flex text-[20px] text-[#585867]'
                                >
                                    <img
                                        className='h-full w-[200px] object-contain mr-[40px]'
                                        src={product?.cover}
                                    />
                                    <div className='w-[230px]'>
                                        <h3>
                                            {product?.medium}
                                        </h3>

                                        <div
                                            className='mb-[15px]'
                                        >
                                            Allgemeine Ausgabe
                                        </div>
                                        <div>
                                            Medien ID: {product?.medien_id}
                                        </div>
                                        <div
                                            className='mb-[15px]'
                                        >
                                            Verlag: {product?.verlag}
                                        </div>

                                        <div className=''>
                                            Nutzung: Click&Study
                                        </div>

                                    </div>


                                </div>

                                <div
                                    className='p-[24px] bg-white flex-1'
                                >
                                    <h4>
                                        Alle Lizenzen für: {product?.medium.split(' ').slice(1).join(' ')}
                                    </h4>
                                    <TableComponent
                                        data={licenses.filter((license) => license.medien_id === selectedMedia)}
                                        header={[
                                            { label: 'Lizenz_id', id: 'lizenz_id', disabled: true },
                                            { label: 'Lizenz-Code', id: 'lizenzcode' },
                                            { label: 'Medien ID', id: 'medien_id' },
                                            { label: 'Verlag', id: 'verlag' },
                                            { label: 'Lizenztyp', id: 'lizenztyp' },
                                            { label: 'Max Nutzer', id: 'lizenzanzahl' },
                                            { label: 'Zugewiesen', id: 'zugewiesen' },
                                            { label: 'Verfügbar', id: 'verfügbar' }
                                        ]}
                                        trigger={mediumtrigger2}
                                        setTrigger={setMediumTrigger2}
                                        filterFunction={(entries: any) => {
                                            if (licenseTypes.length === 0) return entries
                                            let filtered = []
                                            for (const entry of entries) {
                                                if (licenseTypes.map((item) => item.value).includes(entry.lizenztyp)) {
                                                    filtered.push(entry)
                                                }
                                            }
                                            return filtered
                                        }}


                                        disableFooter={true}
                                        highlightOnHover={true}
                                        pickedColor={'#EEF7FE'}
                                        onChangeClickedRow={(identifier: string) => {
                                            setSelectedLicenseId(identifier)

                                        }}
                                        // singleCheckBox={true}
                                        identifier={'lizenz_id'}
                                    />

                                </div>

                                {
                                    selectedLicenseId &&

                                    <div
                                        className='p-[24px] bg-white flex-1 mt-[64px]'
                                    >
                                        <h4>
                                            Freigaben der Lizenz: {selectedLicense.lizenzcode}
                                        </h4>
                                        <TableComponent
                                            data={

                                                filteredUsers.map((user) => transformUserToData(user))

                                            }
                                            header={[
                                                { label: 'Vorname', id: 'vorname' },
                                                { label: 'Nachname', id: 'nachname' },
                                                { label: 'Arbeitsgruppe', id: 'arbeitsgruppe' },
                                                { label: 'Klasse', id: 'klasse' },
                                                { label: 'NutzerId', id: 'nutzerId' }
                                            ]}
                                            identifier={'nutzerId'}
                                            disableFooter={true}
                                            onChangeCheckBox={(selected: any) => {
                                                setSelectedUsers(selected)
                                            }}
                                            checkbox={true}
                                        />
                                        <div className='flex justify-end'>

                                            <Button variant='contained'
                                                disabled={selectedUserIds.length === 0}
                                                onClick={() => {
                                                    const filtered = licenseAssignments.filter((assignment) => {

                                                        return selectedUserIds.includes(assignment.assignee) && assignment.inheritFrom === selectedLicenseId


                                                    })


                                                    for (const filter of filtered) {
                                                        deleteLicenseAssignment(filter.uid)
                                                    }
                                                    setToastProps('Lizenz wurde erfolgreich entzogen')
                                                    let id = selectedLicenseId
                                                    setSelectedLicenseId(null)



                                                }}


                                            >Zuweisung entziehen</Button>
                                        </div>
                                    </div>
                                }


                            </div>


                        </div>


                    </div>

                </>
            }

        </div>
    )

}