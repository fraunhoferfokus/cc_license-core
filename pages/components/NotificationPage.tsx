import { Autocomplete, Paper, TextField} from "@mui/material";
import { useStore } from "../../zustand/store";


export default function NotificationPage(props: any) {
    const { licenseDefinitions, fetchLicenseDefinitions, fetchLicenseAssignments, users, fetchUsers, groups,
        licenseAssignments
    } = useStore(state => state)

    return (<>
        <Paper className="basis-[50%] p-[2%] flex flex-row justify-center items-center overflow-scroll">
            <Autocomplete
                options={users?.map((user: any) => { return { label: user.email, value: user.id } })}
                className='w-[100%] p-2'
                //@ts-ignore
                renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />
                }
            />

        </Paper>
        <Paper className="basis-[50%] p-[2%] flex flex-row justify-center items-center overflow-scroll">
        </Paper>
    </>)
}