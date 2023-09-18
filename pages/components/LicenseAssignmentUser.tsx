
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from "@mui/material"
import { LicenseDefinitionModel, Policy } from "license_manager"
import { useState } from "react"
import { useStore } from "../../zustand/store"
import { PolicyWithMetadata } from "../../zustand/licenseDefinitionSlice"

export default function LicenseAssignmentUser({
    selectedUsers,
    pickedLicenses,
    bilo,
    currentlyAssignedAmount

}: {
    selectedUsers: any,
    pickedLicenses: PolicyWithMetadata[],
    bilo: any,
    currentlyAssignedAmount: any
}) {

    const { licenseAssignments, createLicenseAssignment, deleteLicenseAssignment } = useStore(state => state)

    const [dialogBoxProperties, setDialogBoxProperties] = useState<{
        open: boolean,
        value: string | null,
        userHasThisParticularLicense: Policy | null,
    }>({
        open: false,
        value: null,
        userHasThisParticularLicense: null
    })

    const role = bilo.sonderlizenz

    return (
        <>
            {selectedUsers.map((user: any) => {
                const userLicenseAssignments = licenseAssignments.filter((assignment) => {
                    return assignment.assignee === user.id
                })

                const userHasThisParticularLicense =
                    userLicenseAssignments.find((userAssignment) => {
                        return pickedLicenses.find((license) => license._id === userAssignment.inheritFrom)
                    })

                const isActivated =
                    userHasThisParticularLicense &&
                    userHasThisParticularLicense.action![0].refinement.find((item) =>
                        item.uid === 'aktivierungsstatus' && item.rightOperand === 'true')

                return (<Paper className="flex"
                    key={user.id}
                    square
                    variant="outlined"
                >

                    <Checkbox
                        disabled={
                            role && !user?.gruppen.find((gruppe: any) => gruppe.rolle === role)
                            ||
                            currentlyAssignedAmount === bilo.lizenzanzahl && !userHasThisParticularLicense
                            ||
                            isActivated
                        }


                        checked={
                            userHasThisParticularLicense ? true : false
                        }
                        value={user.id}
                        onChange={
                            (e) => {
                                if (!e.target.checked) {
                                    setDialogBoxProperties(() => ({
                                        open: true, value: e.target.value,
                                        userHasThisParticularLicense: userHasThisParticularLicense!
                                    }))
                                } else {
                                    if (bilo.lizenzTyp === 'Einzellizenz') {
                                        let tempLicense = pickedLicenses[0]
                                        createLicenseAssignment(tempLicense._id, e.target.value)
                                    } else {
                                        // volumelizenz
                                        let tempLicense = pickedLicenses.find((license) =>
                                            !licenseAssignments.find((assignment) => assignment.inheritFrom === license._id)

                                        )!
                                        createLicenseAssignment(tempLicense._id, e.target.value)

                                    }
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
                            deleteLicenseAssignment(dialogBoxProperties.userHasThisParticularLicense!._id)
                            setDialogBoxProperties((props) => ({ ...props, open: false, value: null }))
                        }
                    }>Zustimmen</Button>
                    <Button onClick={
                        () => {
                            setDialogBoxProperties((props) => ({ ...props, open: false, value: null }))
                        }
                    } autoFocus>
                        Abbrechen
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}


