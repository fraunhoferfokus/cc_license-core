
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from "@mui/material"
import { LicenseDefinitionModel } from "license_manager"
import { useState } from "react"
import { useStore } from "../zustand/store"

export default function LicenseAssignmentUser({ selectedUsers, pickedLicense, bilo,
    currentlyAssignedAmount
}: {
    selectedUsers: any, pickedLicense: LicenseDefinitionModel, bilo: any,
    currentlyAssignedAmount: any
}) {
    const { users, groups, licenseAssignments, createLicenseAssignment } = useStore(state => state)

    const [dialogBoxProperties, setDialogBoxProperties] = useState<{ open: boolean, value: string | null }>({
        open: false,
        value: null
    })

    const role = bilo.sonderlizenz




    return (
        <>
            {selectedUsers.map((user: any) => {
                console.log(user.id)
                const licenseAssignment = licenseAssignments.find((assignment) => {
                    return assignment.permissions![0].assignee === user.id
                })

                return (<Paper className="flex"
                    square
                    variant="outlined"
                >

                    <Checkbox
                        disabled={
                            role && !user?.gruppen.find((gruppe: any) => gruppe.rolle === role)
                            ||
                            currentlyAssignedAmount === bilo.lizenzanzahl && !licenseAssignment
                        }
                        checked={
                            licenseAssignment ? true : false
                        }
                        value={user.id}
                        onChange={
                            (e) => {
                                if (!e.target.checked) {
                                    setDialogBoxProperties(() => ({ open: true, value: e.target.value }))
                                } else {
                                    // createLicenseAssignment(pickedLicense._id, e.target.value)
                                }
                            }
                        }
                    />
                    <div
                        className="flex justfiy-center items-center text-center">
                        <b>
                            {user.email}

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


