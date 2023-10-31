"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Select from 'react-select'
import { useStore } from "../../../zustand/store"
import TableComponent from "../../components/Table/TableComponent"

export default function DashboardLayout({
    children, // will be a page or nested layout
    params
}: {
    children: React.ReactNode,
    params: {
        medien_id: string
    }
}) {
    let [licenseTypes, setLicenseTypes] = useState<any[]>([])
    let router = useRouter()

    const {
        licenseDefinitions,
        licenseAssignments,
    } = useStore(state => state)

    const [mediumtrigger2, setMediumTrigger2] = useState(false)

    let medien_id = decodeURIComponent(params.medien_id)
    let targeted_license_deifnition = licenseDefinitions?.find((grouped_license) => {
        let license = grouped_license[0]
        return license.target === medien_id
    })?.[0]

    let product = {
        product_id: targeted_license_deifnition?.target,
        medien_id: targeted_license_deifnition?.metadata.general.identifier,
        medium: targeted_license_deifnition?.metadata.general.title.value,
        verlag: targeted_license_deifnition?.assignee,
        max_nutzer: targeted_license_deifnition?.action![0]?.refinement.find((item) => item.uid === 'lizenzanzahl')?.rightOperand,
        zugewiesen: licenseAssignments.filter((item) => item.target === targeted_license_deifnition?.target).length,
        verfügbar: licenseDefinitions.filter((item) => item[0].target === targeted_license_deifnition?.target).length - licenseAssignments.filter((item) => item.target === targeted_license_deifnition?.target).length,
        cover: targeted_license_deifnition?.metadata.annotation[0].description.value,
    }

    let licenses_of_product = licenseDefinitions?.filter((grouped_license) => {
        let license = grouped_license[0]
        return license.target === medien_id
    }).map((grouped_license) => {
        let license = grouped_license[0]
        let lizenzcode = license.uid.split('/').pop()
        if (!lizenzcode?.includes(product.verlag as string)) lizenzcode = product.verlag + '-' + lizenzcode

        let lizenztyp = license.action![0].refinement.find((item) => item.uid === 'lizenztyp')?.rightOperand
        let zugewiesen = licenseAssignments.filter((item) => item.inheritFrom === license._id).length
        let max_nutzer = license.action![0].refinement.find((item) => item.uid === 'lizenzanzahl')?.rightOperand

        let verfügbar
        if (lizenztyp === 'Einzellizenz') {
            verfügbar = 1 - zugewiesen
        };

        return ({
            lizenz_id: license.uid,
            lizenzcode,
            medien_id: product?.medien_id,
            medium: product?.medium,
            verlag: product?.verlag,
            max_nutzer,
            lizenztyp,
            zugewiesen,
            verfügbar
        })
    })


    // let product = 

    return (

        <div className='flex h-full'>

            <img
                className='cursor-pointer bg-[#585867] rounded-[40%] mr-[20px] self-start h-[30px] w-[30px]'
                src='/previous.svg'
                onClick={() => {
                    router.push('/medien')


                    // setSelectedMedia('')

                }}
            />

            <div
                className='flex-1 h-full'
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
                    className='w-full flex flex-wrap gap-[20px]'
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
                        className='p-[24px] bg-white flex-1 min-w-[950px] h-[500px] rounded-[10px] flex flex-col'
                    >
                        <h4>
                            Alle Lizenzen für: {product?.medium?.split(' ').slice(1).join(' ')}
                        </h4>


                        <TableComponent
                            data={licenses_of_product}
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


                            // disableFooter={true}
                            highlightOnHover={true}
                            pickedColor={'#EEF7FE'}
                            onChangeClickedRow={(identifier: string) => {
                                // setSelectedLicenseId(identifier)
                                if (identifier) router.push(`/medien/${medien_id}/${encodeURIComponent(identifier)}`)
                            }}
                            // singleCheckBox={true}
                            identifier={'lizenz_id'}
                        />



                    </div>

                    {
                        children
                    }
                    {/* {
                        selectedLicenseId &&
                    } */}


                </div>


            </div>


        </div>
    )
}