
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from "@mui/material"
import { useState } from "react"
import { useStore } from "../zustand/store"

export default function LicenseAssignmentUser({ selectedUsers }: { selectedUsers: any }) {
    const { users, groups } = useStore(state => state)

    const [dialogBoxProperties, setDialogBoxProperties] = useState<{ open: boolean, value: string | null }>({
        open: false,
        value: null
    })





    return (
        <>
            {selectedUsers.map((user: any) => {
                return (<Paper className="flex"
                    square
                    variant="outlined"
                >

                    <Checkbox
                        value={"Hello"}
                        onChange={
                            (e) => {
                                if (!e.target.checked) {
                                    setDialogBoxProperties(() => ({ open: true, value: e.target.value }))
                                }
                            }
                        }
                    />
                    <div
                        className="flex justfiy-center items-center text-center">
                        <b>
                            Hello

                        </b>

                    </div>
                </Paper>)
            })
            }

            <Dialog
                open={dialogBoxProperties.open}
                onClose={() => {

                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Wollen sie die Lizenzuweisung rückkängig machen?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={
                        () => {
                            setDialogBoxProperties(() => ({ open: false, value: null }))
                        }
                    }>Zustimmen</Button>
                    <Button onClick={
                        () => {
                            setDialogBoxProperties(() => ({ open: false, value: null }))
                        }
                    } autoFocus>
                        Abbrechen
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}


