import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useStore } from '../../zustand/store';
import TableComponent from '../components/Table/TableComponent';
import RootLayout from '../components/Rooutlayout';

export default function Medien() {
    const router = useRouter()
    const {
        licensesLoading,
        licenseDefinitions,
        licenseAssignments,
        selectedLicenseId,
        myself
    } = useStore(state => state)
    let org = myself?.personenkontexte[0]?.organisation



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
        let medium = license.metadata.general.title.value

        // get the last slash after splitting 
        let lizenzcode = license.uid.split('/').pop()
        let lizenztyp = license.action![0].refinement.find((item) => item.uid === 'lizenztyp')?.rightOperand


        let verfügbar = licenseDefinitions.filter((item) => item[0].target === product_id).length - zugewiesen
        // let verfügbar

        // if (lizenztyp === 'Einzellizenz') {
        //     console.log({ zugewiesen })
        //     verfügbar = zugewiesen ? 0 : 1
        // } else {
        //     verfügbar = licenseDefinitions.filter((item) => item[0].target === product_id).length - zugewiesen
        // }


        let cover = license.metadata.annotation[0].description.value


        let aggregate = {
            product_id,
            medien_id,
            medium,
            verlag,
            max_nutzer,
            zugewiesen,
            verfügbar,
            cover
        }

        if (!products.find((item) => item.product_id === product_id)) products.push(aggregate)

        licenses.push({
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


    let [medium_value, set_medium_value] = useState('')
    const [mediumtrigger, setMediumTrigger] = useState(false)
    const [mediumtrigger2, setMediumTrigger2] = useState(false)
    const [mediumtrigger3, setMediumTrigger3] = useState(false)
    let [licenseTypes, setLicenseTypes] = useState<any[]>([])
    let selectedLicense = licenses.find((item) => item.lizenz_id === selectedLicenseId)
    let targetedUserId = licenseAssignments.filter((assignment) => assignment.inheritFrom === selectedLicense?.lizenz_id).map((assignment) => assignment.assignee)[0]

    useEffect(() => {
        if (licenseTypes.length > 0) setMediumTrigger2(!mediumtrigger2)
    }, [licenseTypes])


    useEffect(() => {
        setMediumTrigger3(!mediumtrigger3)
    }, [targetedUserId])

    return (
        <RootLayout>
            <div className='h-full flex flex-col'>
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
                                    { label: 'Verlag', id: 'verlag' },
                                    { label: 'Klasse', id: 'max_nutzer' },
                                    { label: 'Zugewiesen', id: 'zugewiesen' },
                                    { label: 'Verfügbar', id: 'verfügbar' }

                                ]}
                                headerBackgroundColor={'white'}
                                highlightOnHover={true}
                                onChangeClickedRow={(identifier: string) => {

                                    if (identifier) router.push(`/medien/${identifier}`)
                                    // if (identifier) setSelectedMedia(identifier)

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
                                isLoading={licensesLoading}
                            />
                        </div>
                    </div>
                </>




            </div>
        </RootLayout>
    )

}