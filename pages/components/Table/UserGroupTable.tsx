import { Autocomplete, Checkbox, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { TableData } from "./AssignmentTalbeContainer";
import { useEffect, useState } from "react";
import { useStore } from "../../../zustand/store";
import Select from 'react-select'

function transformUserToData(user: any) {
    let [nachname, vorname] = user.email.split(' ')
    return {
        nachname,
        vorname,
        klasse: user.groups.filter((group: any) => group.type === 'Klasse').map((group: any) => group.displayName).join(', '),
        arbeitsgruppe: user.groups.filter((group: any) => group.type !== 'Klasse').map((group: any) => group.displayName).join(', '),
        nutzerId: user.id,
    }
}


export default function UserGroupTable() {
    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        users,
        fetchUsersAndGroups: fetchUsers,
        groups,
        setNotification,
        notification,
        fetchLicenseDefinitionsV2,
        setPickedUserIds,
        pickedUserIds,
        licenseAssignments
    } = useStore(state => state)


    let [userRows, setUserRows] = useState<TableData[]>(users.map((user: any) => transformUserToData(user)))

    let [page, setPage] = useState(0)
    let [userRowsPerPage, setUserRowsPerPage] = useState(5)
    let [groupOptions, setGroupOptions] = useState<any[]>(groups.map((group: any) => ({ value: group.id, label: group.displayName })))

    let [filteredUsers, setFilteredUsers] = useState<any[]>(users)

    let [selectedValue, setSelectedValue] = useState<any>([])


    let [checked, setChecked] = useState({})

    useEffect(() => {
        setPage(0)
        const rows = filteredUsers.map((user: any) => transformUserToData(user)).slice(0, userRowsPerPage)
        setUserRows(rows)
    }, [userRowsPerPage])


    useEffect(() => {
        const rows = filteredUsers.map((user: any) => transformUserToData(user)).slice(0, userRowsPerPage)
        setUserRows(rows)
    }, [filteredUsers])

    useEffect(
        () => {
            setUserRows(filteredUsers.map((user: any) => transformUserToData(user)).slice(page * userRowsPerPage, page * userRowsPerPage + userRowsPerPage))

        },

        [page]
    )

    useEffect(() => {

        if (selectedValue.length > 0) {
            let tobefiltered: any[] = []
            for (const { label, value } of selectedValue) {
                const group = groups.find((group: any) => group.id === value)
                tobefiltered = [...tobefiltered, ...group.users.map((id: string) => users.find((user) => user.id === id))]
            }

            console.log(tobefiltered.length)

            setFilteredUsers(tobefiltered)
        } else {
            setFilteredUsers(users)
        }
    }, [selectedValue])


    return (
        <>
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
                        className="basic-multi-select "
                        classNamePrefix="select"
                        placeholder=""
                        inputValue={""}
                        onChange={(value) => {
                            setSelectedValue(value)
                        }}

                        styles={{
                            input: () => ({ height: 50, maxHeight: 50, padding: 0, margin: 0, lineHeight: 50, display: 'flex', alignItems: 'center' }),
                            placeholder: () => ({ justifyItems: 'center', display: 'flex' }),
                            // container: () => ({ padding:0, margin:0}),
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
                    <Autocomplete


                        disablePortal
                        id="combo-box-demo"
                        options={[]}
                        sx={{ padding: 0 }}
                        // sx={{ width: 300 }}
                        renderInput={(params) => {
                            return <TextField
                                {...params}
                            // style={{padding:0}}
                            // className="h-[47px]"
                            />
                        }}
                    />

                    <p>
                        Nutzer
                    </p>

                </div>

            </div>

            <Divider />

            <TableContainer component={Paper}
                className="flex-1 overflow-scroll"

            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow
                        >
                            <TableCell
                                sx={{ padding: "10px", height: 50 }}

                            >Checkbox</TableCell>

                            <TableCell
                                sx={{ padding: "10px", height: 50 }}

                            >Vorname</TableCell>
                            <TableCell align="right"
                                sx={{ padding: "10px", height: 50 }}

                            >Nachname</TableCell>
                            <TableCell align="right"
                                sx={{ padding: "10px", height: 50 }}

                            >Arbeitsgruppe</TableCell>
                            <TableCell align="right"
                                sx={{ padding: "10px", height: 50 }}

                            >Klasse</TableCell>
                            <TableCell align="right"
                                sx={{ padding: "10px", height: 50 }}

                            >Nutzer-ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        className="max-h-[50px] h-[50px]"
                    >
                        {userRows.map((row) => (
                            <TableRow
                                key={row.nutzerId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className="max-h-[50px]"
                                style={{ height: '50px', maxHeight: '50px' }}
                            >
                                <TableCell component="th" scope="row"
                                    sx={{ padding: "10px", height: 50 }}

                                >
                                    <Checkbox
                                        checked={pickedUserIds.includes(row.nutzerId)}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setPickedUserIds([...pickedUserIds, row.nutzerId])
                                            } else {
                                                setPickedUserIds(pickedUserIds.filter((id:string) => id !== row.nutzerId))
                                            }
                                        }}

                                    />
                                </TableCell>
                                <TableCell align="right"
                                    sx={{ padding: "10px", height: 50 }}

                                >{row.vorname}</TableCell>

                                <TableCell align="right"
                                    sx={{ padding: "10px", height: 50 }}

                                >{row.nachname}</TableCell>
                                <TableCell align="right"
                                    sx={{ padding: "10px", height: 50 }}

                                >{row.arbeitsgruppe}</TableCell>
                                <TableCell align="right"
                                    sx={{ padding: "10px", height: 50 }}

                                >{row.klasse}</TableCell>
                                <TableCell align="right"
                                    sx={{ padding: "10px", height: 50 }}

                                >{row.nutzerId}</TableCell>
                                {/* <TableCell align="right">{row.protein}</TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pagination flex self-center mt-[30px] mb-[15px]">
                <div>
                    <span
                        className="mr-[10px]"
                    >
                        Rows per page:
                    </span>
                    <select
                        onChange={(e) => {
                            console.log(e.target.value)
                            setUserRowsPerPage(parseInt(e.target.value))
                        }}

                    >
                        <option>5</option>
                        <option>10</option>
                        <option>25</option>
                    </select>
                </div>
                <div
                    className="ml-[20px] mr-[20px]"

                >
                    {page * userRowsPerPage + 1}- {page * userRowsPerPage + userRowsPerPage} of {filteredUsers.length}
                </div>
                <div>
                    <img
                        src="/previous.svg"
                        className="cursor-pointer"
                        onClick={() => {

                            if (page > 0) setPage(page - 1)
                        }}
                    />

                    <img
                        src="/next.svg"
                        className="cursor-pointer"
                        onClick={() => {

                            if (page * userRowsPerPage + userRowsPerPage < filteredUsers.length) setPage(page + 1)
                        }}
                    />



                </div>
            </div>
        </>
    )
}