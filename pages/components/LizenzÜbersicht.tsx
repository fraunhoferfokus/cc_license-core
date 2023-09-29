import { Autocomplete, AutocompleteRenderInputParams, Button, TextField } from '@mui/material';
import { useStore } from '../../zustand/store';
import { ReactNode, useEffect, useState } from 'react';
import TableComponent from './Table/TableComponent';
import Select from 'react-select';
import { transformUserToData } from './Table/UserGroupTable';

export default function Licenses({ setView }: { setView: any }) {
    const {
        licenseDefinitions,
        licenseAssignments,
        setSelectedLicenseId,
        setSelectedMedia,
        myself
    } = useStore(state => state)
    let org = myself?.personenkontexte[0].organisation
    let products: any[] = []
    let licenses: any[] = []
    const [mediumtrigger2, setMediumTrigger2] = useState(false)

    // let [selectedMedia, setSelectedMedia] = useState<any>('')

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
    
    return (
        <>
            <div
                className="h-full flex flex-col p-[10px]"

            >
                <div
                    className="flex justify-between"
                >                    <label
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
                    className='flex flex-col flex-1 mt-[10px]'
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

                            >

                            </TextField>
                            <div
                                className='mt-[5px] pl-[5px]'
                            >
                                Verlag
                            </div>
                        </div>


                        <div
                            className='mr-[10px]'

                        >
                            <TextField
                                placeholder="Lizenztyp"
                                className="bg-white max-w-[700px]  w-[300px]"

                            >

                            </TextField>
                            <div
                                className='mt-[5px] pl-[5px]'
                            >
                                Lizenztyp
                            </div>
                        </div>

                        <div
                            className='mr-[10px]'

                        >
                            <TextField
                                placeholder="Benutzererkennung"
                                className="bg-white max-w-[700px]  w-[300px]"

                            >

                            </TextField>
                            <div
                                className='mt-[5px] pl-[5px]'
                            >
                                Benutzererkennung                        </div>
                        </div>

                        <div
                            className='mr-[10px]'

                        >
                            <TextField
                                placeholder="Medien ID"
                                className="bg-white max-w-[700px]  w-[300px]"

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
                        className='flex-1 flex flex-col bg-white mt-[20px] pt-[30px] pl-[30px] pr-[30px] rounded-[10px]'
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
                                { label: 'Zugewiesen', id: 'zugewiesen' },
                                { label: 'Verfügbar', id: 'verfügbar' }
                            ]}
                            headerBackgroundColor={'white'}
                            trigger={mediumtrigger2}
                            setTrigger={setMediumTrigger2}
                            filterFunction={(entries: any) => {
                                return entries
                                // if (licenseTypes.length === 0) return entries
                                // let filtered = []
                                // for (const entry of entries) {
                                //     if (licenseTypes.map((item) => item.value).includes(entry.lizenztyp)) {
                                //         filtered.push(entry)
                                //     }
                                // }
                                // return filtered
                            }}


                            highlightOnHover={true}
                            pickedColor={'#EEF7FE'}
                            onChangeClickedRow={(identifier: string) => {
                                let license = licenses.find((item) => item.lizenz_id === identifier)
                                if (identifier) {
                                    setSelectedMedia(license.medien_id)
                                    setSelectedLicenseId(identifier)
                                    setView('media')
                                    console.log('setting view')
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