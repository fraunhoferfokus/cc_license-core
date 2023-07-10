import { Button, TextField } from '@mui/material';
import { useStore } from '../../zustand/store';
import { useState } from 'react';
import TableComponent from './Table/TableComponent';

export default function Medien() {


    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        licenseAssignments
    } = useStore(state => state)
    let products: any[] = []

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


        let aggregate = {
            medien_id,
            medium,
            verlag,
            max_nutzer,
            zugewiesen,
            verfügbar,
        }

        if (!products.find((item) => item.product_id === product_id)) products.push(aggregate)

    })

    let [selectedMedia, setSelectedMedia] = useState<any>([])
    let [medium_value, set_medium_value] = useState('')
    const [mediumtrigger, setMediumTrigger] = useState(false)



    return (
        <div className='h-full flex flex-col'>

            <div>
                <label
                    className="text-[#404045] font-bold text-[28px]"
                >Medien</label>
                <div

                    className='mt-[60px] flex justify-between items-center'
                >
                    <Button
                        variant="contained"
                    >
                        Lizenz importieren

                    </Button>

                    <div
                        className='bg-white w-[50%]'
                    >
                        <TextField
                            placeholder='Suche nach Medien'
                            variant='outlined'
                            fullWidth
                        />
                    </div>







                </div >
            </div>

            <div
                className='h-full flex flex-col'
            >
                <p
                    className="mt-[30px] font-bold text-[#404045] text-[20px] "
                >
                    3. Medium wählen
                </p>


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
                        onChangeCheckBox={(identifiers: any[]) => {
                            setSelectedMedia(identifiers)
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



        </div>
    )

}