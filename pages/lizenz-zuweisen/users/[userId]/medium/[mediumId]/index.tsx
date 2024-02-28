"use client"
import { useEffect } from "react"
import TableComponent from "../../../../../components/Table/TableComponent"
import { useStore } from "../../../../../../zustand/store"
import { it } from "node:test"
import TableItemConverter from "../../../../../../helper/table/TableItemConverter"
import { useRouter } from "next/router"
import LizenzUserLayout from "../.."

export default function Medium() {
    const router = useRouter()

    const mediumId = router.query.mediumId as string
    const userId = router.query.userId as string
    const medium_id = mediumId
    const userIds = decodeURIComponent(userId || '').split(',')

    const { licenseDefinitions, licenseAssignments, setSelectedLicenseIds, licensesLoading } = useStore(state => state)

    let medien_id = decodeURIComponent(medium_id || '')
    let availableLicenses = licenseDefinitions?.filter((grouped_license) => {
        let license = grouped_license[0]
        let found = licenseAssignments.find((item) => item.inheritFrom === license._id)
        return license.target === medien_id && !found

    }).map((arr) => arr[0])


    let product = {
        product_id: availableLicenses[0]?.target,
        medien_id: availableLicenses[0]?.metadata.general.identifier,
        medium: availableLicenses[0]?.metadata.general.title.value,
        verlag: availableLicenses[0]?.assignee,
        max_nutzer: availableLicenses[0]?.action![0]?.refinement.find((item) => item.uid === 'lizenzanzahl')?.rightOperand,
        zugewiesen: licenseAssignments.filter((item) => item.target === availableLicenses[0]?.target).length,
        verfügbar: licenseDefinitions.filter((item) => item[0].target === availableLicenses[0]?.target).length - licenseAssignments.filter((item) => item.target === availableLicenses[0]?.target).length,
        cover: availableLicenses[0]?.metadata.annotation[0].description.value,
    }

    return (<>
        <LizenzUserLayout>
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
                        // { label: 'Medien-ID', id: 'medien_id' },
                        { label: 'Medium', id: 'medium' },
                        { label: 'Arbeitsgruppe', id: 'verlag' },
                        { label: 'Klasse', id: 'max_nutzer' },
                        { label: 'Zugewiesen', id: 'zugewiesen' },
                        { label: 'Verfügbar', id: 'verfügbar' }
                    ]}

                    loadingAmount={2}
                    isLoading={licensesLoading}
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
                    className="w-full bg-white flex-1 flex overflow-hidden"
                >
                    <TableComponent
                        data={availableLicenses?.slice(0, userIds?.length).map((item) => {
                            return TableItemConverter.transformToLicenseRow(item, licenseAssignments, licenseDefinitions)
                        }
                        )

                            ||

                            []

                        }

                        loadingAmount={8}
                        isLoading={licensesLoading}
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
        </LizenzUserLayout>
    </>)
}