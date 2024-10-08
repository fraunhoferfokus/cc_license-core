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
import { Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Select from 'react-select';
import TableComponent from "./TableComponent";
import { useStore } from "../../../zustand/store";

const RolleCodeList = {
    LERN: 'Lernende/r',
    LEHR: 'Lehrende/r',
    EXTERN: 'Externe Person',
    ORGADMIN: 'Organisationsadministrator/in',
    LEIT: 'Organisationsleitung',
    SYSADMIN: 'Systemadministrator/in',
}


export function transformUserToData(user: any) {
    if (user) {
            let { lastName: nachname, firstName: vorname } = user
        return {
            nachname,
            vorname,
            klasse: user.groups.filter((group: any) => group.type === 'Klasse').map((group: any) => group.displayName).join(', '),
            arbeitsgruppe: user.groups.filter((group: any) => group.type !== 'Klasse').map((group: any) => group.displayName).join(', '),
            nutzerId: user.id,
            groupIds: user.groups.map((group: any) => group.id),
            role: RolleCodeList[user.role.toUpperCase() as keyof typeof RolleCodeList]
        }

    }
}


export default function UserGroupTable({
    onChangedUsers,
    onChangedGroups,
    users
}:
    {
        onChangedUsers?: (users: any[]) => void,
        onChangedGroups?: (groups: any[]) => void,
        users: any[]
    }
) {
    const [triggerChild, setTriggerChild] = useState(false)


    const {
        pickedLicenseType,
        setPickedLicenseType,
        fetchUsersAndGroups: fetchUsers,
        groups,
        pickedUserIds,
        setPickedUserIds,
        fetchLicenseDefinitionsV2,
        fetchLicenseAssignments,
        loadingUsers
    } = useStore(state => state)

    let [groupOptions, setGroupOptions] = useState<any[]>([])

    let [filteredEntries, setFilteredEntries] = useState<any[]>([])

    let [selectedGroupsSelect, setSelectedGroupsSelect] = useState<any>([])

    let [selectedUser, setSelectedUser] = useState<any>([])


    useEffect(() => {
        setTriggerChild(true)
    },
        [selectedGroupsSelect, selectedUser]
    )

    useEffect(() => {
        if (onChangedUsers) {
            onChangedUsers(pickedUserIds)
        }
    },
        [pickedUserIds])


    useEffect(() => {
        setGroupOptions(groups.map((group: any) => ({ value: group.id, label: group.displayName })))
    }, [groups])

    return (
        <>
            <div className="bg-white 
            rounded-[10px]
            pl-[16px] pt-[16px] pr-[16px] flex-1 overflow-hidden flex flex-col w-full h-full">

                <div
                    className="flex items-center "
                >

                    <div
                        className="flex-[3] flex flex-col justify-center text-[#585867] text-[15px]"
                    >

                        <Select
                            isMulti
                            name="colors"
                            options={users.length > 0 ? groupOptions : []}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder=""
                            inputValue={""}
                            onChange={(value) => {
                                setSelectedGroupsSelect(value)
                            }}


                            styles={{
                                input: (styles) => ({
                                    ...styles, height: 50, maxHeight: 50, padding: 0, margin: 0, lineHeight: 50,
                                    zIndex: 50, display: 'flex', alignItems: 'center'
                                }),
                                container: (styles) => ({ ...styles, padding: 0, margin: 0, zIndex: 100 }),
                            }}
                            value={selectedGroupsSelect}
                        />

                        <p>
                            Gruppe, Klasse oder Kurse auswählen
                        </p>


                    </div>

                    <div
                        className="ml-[50px] flex-[1] max-h-[55px] flex flex-col justify-center text-[#585867] text-[15px]"

                    >

                        <TextField
                            value={selectedUser}
                            onChange={(event) => {
                                setSelectedUser(event.target.value)
                            }}
                            placeholder="Suche nach Nutzer"
                        >

                        </TextField>

                        <p>
                            Nutzer
                        </p>

                    </div>

                </div>

                <TableComponent
                    data={users.map((user: any) => transformUserToData(user))}
                    trigger={triggerChild}
                    setTrigger={setTriggerChild}
                    triggerSetBoxFunction={(pickedIdentifiers: any, setPickedIdentifiers: any) => {
                        let selectedUserIds = groups.filter((group) => {
                            return selectedGroupsSelect.map((selected: any) => selected.value).includes(group.id)
                        })?.map((group) => group.users).flat()
                        return selectedUserIds
                    }}
                    filterFunction={(data: any[]) => {
                        let filteredData = []
                        if (selectedGroupsSelect.length > 0) {
                            filteredData = data.filter((row: any) => {
                                for (const { value } of selectedGroupsSelect) {
                                    if (row.groupIds.includes(value)) {
                                        return true
                                    }
                                }
                            })
                        } else {
                            filteredData = data
                        }

                        if (selectedUser.length > 0) {
                            filteredData = filteredData.filter((row: any) => {
                                for (const key in row) {
                                    // check if string
                                    if (typeof row[key] === 'string') {
                                        if (row[key].toLowerCase().includes(selectedUser.toLowerCase())) {
                                            return true
                                        }
                                    }
                                }
                            })
                        }

                        return filteredData
                    }}
                    checkbox={pickedLicenseType !== 'Lerngruppenlizenz'}
                    // singleCheckBox={pickedLicenseType === 'Einzellizenz'}
                    identifier={'nutzerId'}
                    header={[
                        { label: 'Vorname', id: 'vorname' },
                        { label: 'Nachname', id: 'nachname' },
                        { label: 'Rolle', id: 'role' },
                        { label: 'Lerngruppe', id: 'arbeitsgruppe' },
                        { label: 'Klasse', id: 'klasse' },
                        // { label: 'NutzerId', id: 'nutzerId' },
                    ]}
                    onChangeCheckBox={(identifiers: any[]) => {
                        setPickedUserIds(identifiers)
                    }}
                    onChangeFilteredEntries={(entries: any[]) => {
                        // setFilteredEntries(entries)
                    }}
                    isLoading={loadingUsers}
                />
            </div>

        </>
    )
}