"use client"
import { useEffect } from "react"
import TableItemConverter from "../../../../../../helper/table/TableItemConverter"
import { useStore } from "../../../../../../zustand/store"
import TableComponent from "../../../../../components/Table/TableComponent"

export default function Medium({ params }: {
    params: {
        medium_id: string,
        user_ids: string
    }
}) {
    
    const medium_id = params.medium_id
    const userIds = decodeURIComponent(params?.user_ids || '').split(',')

    const { licenseDefinitions, licenseAssignments, setSelectedLicenseIds } = useStore(state => state)

    let medien_id = decodeURIComponent(medium_id || '')

    let targeted_license_definitions = licenseDefinitions?.find((grouped_license) => {
        let license = grouped_license[0]
        return license.target === medien_id
    })
    let targeted_license_definition = targeted_license_definitions?.[0]

    let product = {
        product_id: targeted_license_definition?.target,
        medien_id: targeted_license_definition?.metadata.general.identifier,
        medium: targeted_license_definition?.metadata.general.title.value,
        verlag: targeted_license_definition?.assignee,
        max_nutzer: targeted_license_definition?.action![0]?.refinement.find((item) => item.uid === 'lizenzanzahl')?.rightOperand,
        zugewiesen: licenseAssignments.filter((item) => item.target === targeted_license_definition?.target).length,
        verfügbar: licenseDefinitions.filter((item) => item[0].target === targeted_license_definition?.target).length - licenseAssignments.filter((item) => item.target === targeted_license_definition?.target).length,
        cover: targeted_license_definition?.metadata.annotation[0].description.value,
    }


    useEffect(() => {
        setSelectedLicenseIds(targeted_license_definitions?.slice(0, userIds?.length).map((item) => item.uid) || [])
    }, [targeted_license_definitions])

    return (<>

        <div>
            <p
                className="mt-[30px] font-bold text-[#404045] text-[20px]"
            >
                3. Gewähltes Medium
            </p>
            <TableComponent
                data={[product]}
                checkbox={false}
                header={[
                    { label: 'Medien-ID', id: 'medien_id' },
                    { label: 'Medium', id: 'medium' },
                    { label: 'Arbeitsgruppe', id: 'verlag' },
                    { label: 'Klasse', id: 'max_nutzer' },
                    { label: 'Zugewiesen', id: 'zugewiesen' },
                    { label: 'Verfügbar', id: 'verfügbar' }
                ]}
                disableFooter={true}
                entryBackgroundColor={'transparent'}
                headerBackgroundColor={'#DFDFDF'}
            />
        </div>



        <div className="w-full flex-1 flex flex-col">
            <p
                className="mt-[30px] font-bold text-[#404045] text-[20px] "
            >
                4. Lizenzen auswählen
            </p>
            <div
                className="w-full bg-white flex-1 flex"
            >
                <TableComponent
                    data={targeted_license_definitions?.slice(0, userIds?.length).map((item) => {
                        return TableItemConverter.transformToLicenseRow(item, licenseAssignments, licenseDefinitions)
                    }



                    )

                        ||

                        []

                    }
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
                    onChangeCheckBox={(identifiers: any[]) => {
                        // setSelectedLicenses(identifiers)
                    }}
                    checkBoxDisabledFunction={(identifier: any) => {
                        return true;
                        // const license = licenses.find((license) => license.lizenz_id === identifier)
                        // if (license.verfügbar === 0) return true

                    }}
                    checkBoxCheckedFunction={(identifier: any) => {
                        return true;
                        // const license = licenses.find((license) => license.lizenz_id === identifier)
                        // if (license.verfügbar === 0) return true
                    }}
                    checkbox={true}
                    // singleCheckBox={true}
                    identifier={'lizenz_id'}
                />
            </div>


        </div>




    </>)
}