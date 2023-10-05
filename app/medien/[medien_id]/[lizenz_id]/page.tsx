"use client"
import TableComponent from "../../../components/Table/TableComponent"
import { transformUserToData } from "../../../components/Table/UserGroupTable"
import { useStore } from '../../../../zustand/store'
import { Button } from "@mui/material"
import { useState } from "react"
export default function Page({ params }: { params: { lizenz_id: string } }) {
    let { lizenz_id } = params
    lizenz_id = decodeURIComponent(lizenz_id)

    const { licenseAssignments, deleteLicenseAssignment, setToastProps, selectedLicenseId, setSelectedLicenseId, users, fetchUsersAndGroups, fetchLicenseDefinitionsV2, fetchLicenseAssignments, myself, licenseDefinitions } = useStore(state => state)

    const [mediumtrigger3, setMediumTrigger3] = useState(false)
    const license = licenseDefinitions?.find((grouped_license) => grouped_license.some((item) => item.uid === lizenz_id))?.find((item) => item.uid === lizenz_id)

    const action = license?.action?.[0]
    let refinement = action?.refinement
    let lizenzcode = refinement?.find((item) => item.uid === 'lizenzcode')?.rightOperand


    let userIds = licenseAssignments?.filter((item) => item.inheritFrom === lizenz_id).map((item) => item.assignee)

    let [selectedUserCheckbox, setSelectedUserCheckbox] = useState<any[]>([])

    return (
        <>
            <div
                className='p-[24px] bg-white flex-1 mt-[64px]'
            >
                <h4>
                    Freigaben der Lizenz: {lizenzcode}
                </h4>
                <TableComponent
                    data={
                       userIds?.map((userId) => {
                            return transformUserToData(users?.find((user) => user.uid === userId))
                        })
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
                        setSelectedUserCheckbox(selected)
                    }}
                    checkbox={true}
                    setTrigger={setMediumTrigger3}
                    trigger={mediumtrigger3}
                    filterFunction={(data: any[]) => {
                        return data
                    }}
                />
                <div className='flex justify-end'>

                    <Button variant='contained'
                        disabled={selectedUserCheckbox.length === 0}
                        onClick={() => {
                            const filtered = licenseAssignments.filter((assignment) => {

                                return selectedUserCheckbox.includes(assignment.assignee) && assignment.inheritFrom === selectedLicenseId


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
        </>
    )
}