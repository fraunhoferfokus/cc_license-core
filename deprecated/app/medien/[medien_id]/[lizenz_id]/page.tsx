/* -----------------------------------------------------------------------------
 *  Copyright (c) 2023, Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.   
 *
 *  No Patent Rights, Trademark Rights and/or other Intellectual Property 
 *  Rights other than the rights under this license are granted. 
 *  All other rights reserved.
 *
 *  For any other rights, a separate agreement needs to be closed.
 * 
 *  For more information please contact:   
 *  Fraunhofer FOKUS
 *  Kaiserin-Augusta-Allee 31
 *  10589 Berlin, Germany 
 *  https://www.fokus.fraunhofer.de/go/fame
 *  famecontact@fokus.fraunhofer.de
 * -----------------------------------------------------------------------------
 */
"use client"
import TableComponent from "../../../components/Table/TableComponent"
import { transformUserToData } from "../../../components/Table/UserGroupTable"
import { useStore } from '../../../../../zustand/store'
import { Button } from "@mui/material"
import { useState } from "react"
export default function Page({ params }: { params: { lizenz_id: string } }) {
    let { lizenz_id } = params
    lizenz_id = decodeURIComponent(lizenz_id)

    const { licenseAssignments, deleteLicenseAssignment, setToastProps, users, licenseDefinitions } = useStore(state => state)

    const [mediumtrigger3, setMediumTrigger3] = useState(false)
    const license = licenseDefinitions?.find((grouped_license) => grouped_license.some((item) => item.uid === lizenz_id))?.find((item) => item.uid === lizenz_id)

    const action = license?.action?.[0]
    let refinement = action?.refinement
    let lizenzcode = refinement?.find((item) => item.uid === 'lizenzcode')?.rightOperand


    let userIds = licenseAssignments?.filter((item) => item.inheritFrom === lizenz_id).map((item) => item.assignee)

    let [selectedUserCheckbox, setSelectedUserCheckbox] = useState<any[]>([])

    // let users = usersIds?.map((userId) => {})
    return (
        <>
            <div
                className='p-[24px] bg-white flex-1 mt-[14px]'
            >
                <h4>
                    Freigaben der Lizenz: {lizenzcode}
                </h4>
                <TableComponent
                    data={
                        userIds?.map((userId) => {
                            return transformUserToData(users?.find((user) => user.id === userId))
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
                {
                    selectedUserCheckbox.length !== 0 && <div className='flex justify-end mt-[10px]'>

                        <Button variant='contained'

                            onClick={() => {
                                const filtered = licenseAssignments.filter((assignment) => {
                                    return selectedUserCheckbox.includes(assignment.assignee) && assignment.inheritFrom === lizenz_id
                                })

                                for (const filter of filtered) {
                                    deleteLicenseAssignment(filter.uid)
                                }
                                setToastProps('Lizenz wurde erfolgreich entzogen')
                                // if (setSelectedLicenseId) setSelectedLicenseId(null)
                                if (selectedUserCheckbox) setSelectedUserCheckbox([])
                            }}


                        >Zuweisung entziehen</Button>
                    </div>

                }

            </div>
        </>
    )
}