import { Autocomplete, Button, Checkbox, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { MultiValue, ActionMeta, InputActionMeta } from "react-select";
import Select from "react-select";
import { useStore } from '../../../zustand/store'
import { useEffect, useRef, useState } from "react"
import UserGroupTable from "./UserGroupTable";

export interface TableData {
    nachname: string,
    vorname: string,
    klasse: string,
    arbeitsgruppe: string,
    nutzerId: string,
}






export default function AssignmentTableContainer() {
    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        users,
        fetchUsersAndGroups: fetchUsers,
        groups,
        setNotification,
        notification,
        fetchLicenseDefinitionsV2,

        licenseAssignments
    } = useStore(state => state)


    useEffect(() => {
        fetchLicenseDefinitionsV2()
        fetchUsers()
        fetchLicenseAssignments()
    }, [])








    return (

        <>
            <div className="bg-white pl-[16px] pt-[46px] pr-[16px] flex-1 overflow-scroll flex flex-col w-full">
                <UserGroupTable />
            </div>


        </>
    )


}