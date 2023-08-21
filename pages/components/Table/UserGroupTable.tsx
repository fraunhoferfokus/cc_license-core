import { Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { useStore } from "../../../zustand/store";
import TableComponent from "./TableComponent";

export function transformUserToData(user: any) {
    let [nachname, vorname] = user.email.split(' ')
    return {
        nachname,
        vorname,
        klasse: user.groups.filter((group: any) => group.type === 'Klasse').map((group: any) => group.displayName).join(', '),
        arbeitsgruppe: user.groups.filter((group: any) => group.type !== 'Klasse').map((group: any) => group.displayName).join(', '),
        nutzerId: user.id,
        groupIds: user.groups.map((group: any) => group.id)
    }
}


export default function UserGroupTable({
    onChangedUsers,
    onChangedGroups
}:
    {
        onChangedUsers?: (users: any[]) => void,
        onChangedGroups?: (groups: any[]) => void
    }
) {

    const [triggerChild, setTriggerChild] = useState(false)


    const {
        users,
        pickedLicenseType,
        setPickedLicenseType,
        fetchUsersAndGroups: fetchUsers,
        groups,
        pickedUserIds,
        setPickedUserIds,
        fetchLicenseDefinitionsV2,
        fetchLicenseAssignments,
    } = useStore(state => state)

    let [groupOptions, setGroupOptions] = useState<any[]>(groups.map((group: any) => ({ value: group.id, label: group.displayName })))

    let [filteredEntries, setFilteredEntries] = useState<any[]>([])

    let [selectedValue, setSelectedValue] = useState<any>([])

    let [selectedUser, setSelectedUser] = useState<any>([])


    useEffect(() => {
        setTriggerChild(true)
    },
        [selectedValue, selectedUser]
    )


    useEffect(() => {
        fetchLicenseDefinitionsV2()
        fetchUsers()
        fetchLicenseAssignments()
    }, [])

    useEffect(() => {
        if (onChangedUsers) {
            onChangedUsers(pickedUserIds)
        }
    },
        [pickedUserIds]

    )

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
                            options={groupOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder=""
                            inputValue={""}
                            onChange={(value) => {
                                setSelectedValue(value)
                            }}


                            styles={{
                                input: (styles) => ({
                                    ...styles, height: 50, maxHeight: 50, padding: 0, margin: 0, lineHeight: 50,
                                    zIndex: 50, display: 'flex', alignItems: 'center'
                                }),
                                // placeholder: (styles) => ({ ...styles, justifyItems: 'center', display: 'flex' }),
                                container: (styles) => ({ ...styles, padding: 0, margin: 0, zIndex: 100 }),
                                // option: (styles) => ({ ...styles, padding: 0, margin: 0, lineHeight: 50, zIndex:100 }),
                                // control: () => ({height:50 })
                            }}
                            value={selectedValue}


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
                    filterFunction={(data: any[]) => {
                        let filteredData = []
                        if (selectedValue.length > 0) {
                            filteredData = data.filter((row: any) => {
                                for (const { value } of selectedValue) {
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
                    singleCheckBox={pickedLicenseType === 'Einzellizenz'}
                    identifier={'nutzerId'}
                    header={[
                        { label: 'Vorname', id: 'vorname' },
                        { label: 'Nachname', id: 'nachname' },
                        { label: 'Arbeitsgruppe', id: 'arbeitsgruppe' },
                        { label: 'Klasse', id: 'klasse' },
                        { label: 'NutzerId', id: 'nutzerId' }
                    ]}
                    onChangeCheckBox={(identifiers: any[]) => {
                        setPickedUserIds(identifiers)
                    }}
                    onChangeFilteredEntries={(entries: any[]) => {
                        setFilteredEntries(entries)
                    }}
                />
            </div>

        </>
    )
}