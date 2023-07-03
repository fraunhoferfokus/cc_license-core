import { Autocomplete, Box, Button, Divider, Link, MenuItem, MenuList, Paper, Select, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useStore } from '../../zustand/store'
import { PolicyWithMetadata } from "../../zustand/licenseDefinitionSlice";
import { toBILO } from "../../helper/helper";
import { Policy } from "license_manager";
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AddLicenseModal from "./AddLicenseModal";
import LicenseAssignmentUser from "./LicenseAssignmentUser";
import LicenseAssignmentGroup from "./LicenseAssigmentGroup";
import NotificationPage from "./NotificationPage";
import FunctionButton from "./Buttons/FunctionButton";
import AssignmentTableContainer from "./Table/AssignmentTalbeContainer";


export default function LizenzZuweisungV2({ setLicenseModal, setView }: { setLicenseModal: any, setView: any }) {

    const [pickedLicenseType, setPickedLicenseType] = useState('placeholder')


    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        users,
        fetchUsersAndGroups: fetchUsers,
        groups,
        setNotification,
        notification,
        fetchLicenseDefinitionsV2,
        pickedUserIds,
        stepper,
        setStepper,
        licenseAssignments
    } = useStore(state => state)
    const [pickedLicenses, setPickedLicenses] = useState<PolicyWithMetadata[]>([])


    const [pickedSelect, setPickedSelect] = useState('placeholder')
    const [selectedUsers, setSelectedUsers] = useState<any>(users)
    const [selectedGroups, setSelectedGroups] = useState<any>([])

    // let constraints = pickedLicenses ? (pickedLicenses![0]!.action![0].refinement as Constraint[]) : null

    let pickedLicense: (Policy & { metadata: any }) | null = pickedLicenses ? pickedLicenses[0] as any : null
    let bilo = toBILO(pickedLicense!)
    const currentlyAssignedAmount =
        bilo?.lizenztyp === 'Einzellizenz' ?
            licenseAssignments?.filter((item) => item.inheritFrom! === pickedLicense?._id).length
            :
            bilo?.lizenztyp === 'Gruppenlizenz' ? licenseAssignments?.filter((item) =>
                item.inheritFrom! === pickedLicense?._id
                &&
                ((item.action![0] as ActionObject).refinement as Constraint[]).find((item) => item.rightOperand === 'group')
            ).length :

                pickedLicenses?.filter((license: Policy) => licenseAssignments.find((assignment) => assignment.inheritFrom === license.uid)).length

    const autoC = useRef(null);


    const [page, setPage] = useState('assignment')
    useEffect(() => {
        fetchLicenseDefinitionsV2()
        fetchUsers()
        fetchLicenseAssignments()

        const interval = setInterval(() => {
            fetchLicenseAssignments()
        }, 1000 * 5)

        return () => {
            clearInterval(interval)
        }

    }, [])

    useEffect(() => {
        const ref: any = autoC.current
        const cross = ref?.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
        if (cross) {
            cross.click()
        }
    }, [pickedSelect])

    useEffect(() => {
        if (bilo?.lizenztyp === 'Gruppenlizenz') setPickedSelect('group')
    }, [bilo])


    let validStepOne = pickedUserIds.length > 0


    return (

        <>
            <label
                className="text-[#404045] font-bold text-[28px]"
            >Lizenz zuweisen</label>


            {
                stepper === 0 &&
                <> <p
                    className="mt-[67px] font-bold text-[#404045] text-[20px]"
                >
                    1. Wähle eine Lizenzart:
                </p>

                    <div className="Funktionen flex items-center flex-wrap">

                        <FunctionButton
                            infoText={'Selektion einer Klasse, Lerngruppe oder Nutzer'}
                            buttonTitle={'Einzellizenz'}
                            iconPath={'/person.svg'}
                            callback={async () => {
                                setPickedLicenseType('Einzellizenz')
                                // setLicenseModal(true)
                            }}
                            clicked={pickedLicenseType === 'Einzellizenz'}
                            color="#FBD19C"

                        />

                        <FunctionButton
                            infoText={'Selektion einer Klasse, Lerngruppe oder Nutzer'}
                            buttonTitle={'Volumenlizenz'}
                            iconPath={'/persons.svg'}
                            callback={() => {
                                setPickedLicenseType('Volumenlizenz')
                                // setView('assignment')
                            }}
                            clicked={pickedLicenseType === 'Volumenlizenz'}
                            color="#F9F3C4"
                        />

                        <FunctionButton
                            infoText={'Nur selektion einer Klasse oder Lerngruppe mögilch'}
                            buttonTitle={'Lerngruppenlizenz'}
                            iconPath={'/map.svg'}
                            callback={() => {
                                setPickedLicenseType('Lerngruppenlizenz')
                                // setView('media')
                            }}
                            clicked={pickedLicenseType === 'Lerngruppenlizenz'}
                            color="#DFC0EB"
                        />
                    </div>

                    <p
                        className="mt-[40px] font-bold text-[#404045] text-[20px]"
                    >
                        2. Lerngruppe oder Klasse auswählen
                    </p>
                    <AssignmentTableContainer />
                </>

            }



            {
                stepper === 1 &&
                <>
                    <div>
                        <p
                            className="mt-[67px] font-bold text-[#404045] text-[20px]"
                        >
                            1. Gewählte Lizenz
                        </p>

                        <FunctionButton
                            infoText={'Selektion einer Klasse, Lerngruppe oder Nutzer'}
                            buttonTitle={'Einzellizenz'}
                            iconPath={'/person.svg'}
                            callback={async () => {
                                setPickedLicenseType('Einzellizenz')
                                // setLicenseModal(true)
                            }}
                            clicked={pickedLicenseType === 'Einzellizenz'}
                            color="rgba(237,237,237,1)"
                            disableInfo={true}

                        />

                        <p
                            className="mt-[67px] font-bold text-[#404045] text-[20px]"
                        >
                            2. Gewählter Nutzer
                        </p>
                    </div>


                </>
            }





            <div
                className="self-end mt-[20px] flex justify-between w-[100%]"
            >

                {
                    stepper > 0 ?
                        <Button
                            variant="contained"
                            onClick={() => setStepper(stepper - 1)}
                        >
                            Zurück

                        </Button> :
                        <div></div>

                }



                <Button
                    variant="contained"
                    disabled={!validStepOne}
                    onClick={() => setStepper(stepper + 1)}
                >
                    Weiter

                </Button>
            </div>
        </>
    )
}