import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from "@mui/material"
import { LicenseDefinitionModel } from "license_manager"
import { useState } from "react"
import { useStore } from "../../zustand/store"


export default function LicenseAssignmentGroup({
    selectedGroups,
    pickedLicenses,
    bilo,
    currentlyAssignedAmount

}:

    {
        selectedGroups: any,
        pickedLicenses: LicenseDefinitionModel[],
        bilo: any,
        currentlyAssignedAmount: any
    }) {


    const { users, groups, deleteLicenseAssignment, licenseAssignments, createLicenseAssignment } = useStore(state => state)
    const [dialogBoxProperties, setDialogBoxProperties] = useState<{
        open: boolean,
        value: string | null,
        particularLicense: any,
    }>({
        open: false,
        value: null,
        particularLicense: null
    })

    const role = bilo.sonderlizenz

    console.log(selectedGroups)




    return (
        <>
            {selectedGroups.map((group: any) => {
                const groupLicenseAssignments = licenseAssignments.filter((assignment) => {
                    return assignment.permissions![0].assignee === group.id
                })

                const groupHasThatParticularLicense =
                    groupLicenseAssignments.find((groupAssignment) => {
                        return pickedLicenses.find((license) => license.policyid === groupAssignment.inheritfrom)
                    })

                const usersInGroup = users.filter((user) => user.gruppen.map((group: any) => group.id).includes(group.id))
                return (<Paper className="flex min-h-[42px] p-1 overflow-scroll flex-1
                "
                    key={group.id}
                    square
                    variant="outlined"
                >
                    {bilo.lizenztyp === 'Gruppenlizenz' &&
                        <Checkbox
                            disabled={
                                currentlyAssignedAmount >= bilo.lizenzanzahl && !groupHasThatParticularLicense
                            }
                            checked={
                                groupHasThatParticularLicense ? true : false
                            }
                            value={group.id}
                            onChange={
                                (e) => {
                                    if (!e.target.checked) {
                                        setDialogBoxProperties(() => ({
                                            open: true, value: e.target.value,
                                            particularLicense: groupHasThatParticularLicense
                                        }))
                                    } else {
                                        let tempLicense = pickedLicenses[0]
                                        createLicenseAssignment(tempLicense._id, e.target.value)
                                    }
                                }
                            }
                        />
                    }

                    <div
                        className="flex w-full">
                        <div className="flex flex-1 flex-col w-full">
                            <div>
                                <b className="p-2">
                                    {group.displayName}
                                </b>
                            </div>

                            <div className="p-3">
                                {
                                    usersInGroup.map((user) => {

                                        const userLicenseAssignments = licenseAssignments.filter((assignment) => {
                                            return assignment.permissions![0].assignee === user.id
                                        })

                                        const userHasThisParticularLicense =
                                            userLicenseAssignments.find((userAssignment) => {
                                                return pickedLicenses.find((license) => license.policyid === userAssignment.inheritfrom)
                                            })

                                        return (
                                            <Paper className="min-h-[42px] flex "
                                                variant="outlined"
                                            >
                                                <Checkbox
                                                    disabled={
                                                        bilo.lizenztyp === 'Gruppenlizenz' ||
                                                        role && !user?.gruppen.find((gruppe: any) => gruppe.rolle === role)
                                                        ||
                                                        currentlyAssignedAmount === bilo.lizenzanzahl && !userHasThisParticularLicense
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
                                                                    particularLicense: userHasThisParticularLicense
                                                                }))
                                                            } else {
                                                                if (bilo.lizenzTyp === 'Einzellizenz') {
                                                                    let tempLicense = pickedLicenses[0]
                                                                    createLicenseAssignment(tempLicense._id, e.target.value)
                                                                } else {
                                                                    // volumelizenz
                                                                    let tempLicense = pickedLicenses.find((license) =>
                                                                        !licenseAssignments.find((assignment) => assignment.inheritfrom === license.policyid)

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


                                            </Paper>

                                        )

                                    })
                                }
                            </div>



                        </div>
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
                            deleteLicenseAssignment(dialogBoxProperties.particularLicense.policyid)
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


