// Hello Fraunhofer
import { Button, TextField } from "@mui/material";
import { Policy } from "license_manager";
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2";
import { useEffect, useRef, useState } from "react";
import { toBILO } from "../../helper/helper";
import { PolicyWithMetadata } from "../../zustand/licenseDefinitionSlice";
import { useStore } from '../../zustand/store';
import FunctionButton from "./Buttons/FunctionButton";
import TableComponent from "./Table/TableComponent";
import UserGroupTable, { transformUserToData } from "./Table/UserGroupTable";


export default function LizenzZuweisungV2({ setLicenseModal, setView }: { setLicenseModal: any, setView: any }) {
    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        users,
        fetchUsersAndGroups: fetchUsers,
        fetchLicenseDefinitionsV2,
        pickedUserIds,
        stepper,
        setStepper,
        licenseAssignments,
        pickedLicenseType,
        setPickedLicenseType,
        createLicenseAssignment,
        myself
    } = useStore(state => state)
    const [pickedLicenses, setPickedLicenses] = useState<PolicyWithMetadata[]>([])
    const [mediumtrigger, setMediumTrigger] = useState(false)
    const [pickedSelect, setPickedSelect] = useState('placeholder')
    const [selectedUsersId, setSelectedUsers] = useState<any>([])
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

    let [selectedMedia, setSelectedMedia] = useState<any>(null)

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
    let validStepTwo = selectedMedia ? true : false

    let products: any[] = []


    let licenses: any[] = []

    licenseDefinitions?.forEach((grouped_liceses) => {
        let license = grouped_liceses[0]
        let product_id = license.target
        let metadata = license.metadata
        let max_nutzer = license.action![0].refinement.find((item) => item.uid === 'lizenzanzahl')?.rightOperand
        let medien_id = metadata.general.identifier
        let verlag = license.assignee
        let zugewiesen = licenseAssignments.filter((item) => item.target === product_id).length
        let verfügbar = licenseDefinitions.filter((item) => item[0].target === product_id).length - zugewiesen
        let medium = license.metadata.general.title.value

        // get the last slash after splitting 
        let lizenzcode = license.uid.split('/').pop()
        let lizenztyp = license.action![0].refinement.find((item) => item.uid === 'lizenztyp')?.rightOperand


        let aggregate = {
            medien_id,
            medium,
            verlag,
            max_nutzer,
            zugewiesen,
            verfügbar,
            product_id
        }


        if (!products.find((item) => item.product_id === product_id)) products.push(aggregate)
        licenses.push({
            lizenz_id: license.uid,
            lizenzcode,
            medien_id,
            medium,
            verlag,
            lizenztyp,
            max_nutzer,
            zugewiesen,
            verfügbar,
        })
    })
    let [selectedLicenses, setSelectedLicenses] = useState<any>([])
    let [medium_value, set_medium_value] = useState('')


    useEffect(() => {
        setMediumTrigger(true)
    }, [medium_value])


    useEffect(() => {

        if (stepper === 2) {
            const sliced_licenses = licenses.filter((license) => license.medien_id === selectedMedia && !licenseAssignments.find((assignment) => assignment.inheritFrom === license.lizenz_id)).slice(0, selectedUsersId.length)
            setSelectedLicenses(sliced_licenses)
        }

        if (stepper === 3) {
            for (let i = 0; i < selectedLicenses?.length; i++) {
                createLicenseAssignment(selectedLicenses[i].lizenz_id, selectedUsersId[i])
            }
            setStepper(0)
            setSelectedUsers([])
            setPickedLicenseType('Einzel')
            setSelectedLicenses([])
        }
    }, [stepper])

    useEffect(() => {
        console.log(selectedUsersId)
    }, [selectedUsersId])

    useEffect(() => console.log(selectedLicenses), [selectedLicenses])





    let org = myself?.personenkontexte[0]?.organisation

    return (

        <div
            className="h-full flex flex-col flex"

        >
            <div
                className="flex justify-between"
            >
                <label
                    className="text-[#404045] font-bold text-[28px]"
                >
                    Lizenz Zuweisen
                </label>
                <div>
                    <div
                        className="h-[35px] bg-[rgba(0,0,0,0.06)] h-[41px] flex items-center 
                        justify-center text-[16px] mb-[3px]"
                    >
                        <label

                        >
                            {org?.name}
                        </label>
                    </div>
                    <div
                        className="text-[rgba(0,0,0,0.6)] text-[12px]"
                    >
                        Die Schule, für die eine Zuweisung erfolgt
                    </div>
                </div>
            </div>


            {
                stepper === 0 &&
                <>
                    <div
                        className="flex flex-col overflow-hidden flex-1"
                    >

                        <p
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
                        <UserGroupTable
                            onChangedUsers={(selectedUserIds) => {
                                setSelectedUsers(selectedUserIds)
                            }}
                            onChangedGroups={(groups) => { }}
                        />
                    </div>
                </>

            }



            {
                stepper >= 1 &&
                <>
                    <div className="h-full flex flex-col">

                        <div
                            className="flex flex-wrap content-start justify-start"
                        >
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

                            </div>

                            <div>
                                <p
                                    className="mt-[30px] font-bold text-[#404045] text-[20px]"
                                >
                                    2. Gewählte Nutzer
                                </p>
                                <TableComponent
                                    data={users.filter((user) => pickedUserIds.includes(user.id)).map((user) => (transformUserToData(user)))}
                                    checkbox={false}
                                    headerBackgroundColor={'#DFDFDF'}
                                    entryBackgroundColor={'transparent'}
                                    header={[
                                        { label: 'Vorname', id: 'vorname' },
                                        { label: 'Nachname', id: 'nachname' },
                                        { label: 'Arbeitsgruppe', id: 'arbeitsgruppe' },
                                        { label: 'Klasse', id: 'klasse' },
                                        { label: 'NutzerId', id: 'nutzerId' }
                                    ]}
                                    disableFooter={true}
                                    onChangeCheckBox={(selected: any) => {
                                        // setSelectedUsers(selected)
                                    }}
                                />

                            </div>






                            {stepper >= 2 &&

                                <div>
                                    <p
                                        className="mt-[30px] font-bold text-[#404045] text-[20px]"
                                    >
                                        3. Gewähltes Medium
                                    </p>
                                    <TableComponent
                                        data={selectedMedia ? [products.find((product) => product.medien_id === selectedMedia)] : []}
                                        checkbox={false}
                                        header={[
                                            { label: 'Medien-ID', id: 'medien_id' },
                                            { label: 'Medium', id: 'medium' },
                                            { label: 'Arbeitsgruppe', id: 'verlag' },
                                            { label: 'Klasse', id: 'max_nutzer' },
                                            { label: 'Zugewiesen', id: 'zugewiesen' },
                                            { label: 'Verfügbar', id: 'verfügbar' }
                                        ]}
                                        disableFooter={true}
                                        entryBackgroundColor={'transparent'}
                                        headerBackgroundColor={'#DFDFDF'}

                                    />

                                </div>
                            }

                        </div>

                        {
                            stepper === 1 && <div className="w-full flex-1 flex flex-col">
                                <p
                                    className="mt-[30px] font-bold text-[#404045] text-[20px] "
                                >
                                    3. Medium wählen
                                </p>

                                <TextField
                                    placeholder="Suche nach Medium"
                                    className="bg-white max-w-[700px] mb-[30px]"
                                    value={medium_value}
                                    onChange={(e) => {
                                        set_medium_value(e.target.value)
                                    }}
                                >

                                </TextField>

                                <div
                                    className="w-full bg-white flex-1 flex"
                                >
                                    <TableComponent
                                        data={products.length > 0 ? products : []}
                                        header={[
                                            { label: 'Medien-ID', id: 'medien_id' },
                                            { label: 'Medium', id: 'medium' },
                                            { label: 'Arbeitsgruppe', id: 'verlag' },
                                            { label: 'Max Nutzer', id: 'max_nutzer' },
                                            { label: 'Zugewiesen', id: 'zugewiesen' },
                                            { label: 'Verfügbar', id: 'verfügbar' }

                                        ]}
                                        onChangeCheckBox={(identifiers: any[]) => {
                                            setSelectedMedia(identifiers[0])
                                        }}
                                        checkbox={true}
                                        singleCheckBox={true}
                                        identifier={'medien_id'}
                                        filterFunction={(data: any[]) => {

                                            if (medium_value === '') return data

                                            return data.filter((item) => {
                                                for (let key in item) {
                                                    // check if item[key] is string
                                                    if (typeof item[key] === 'string') {
                                                        if (item[key].toLowerCase().includes(medium_value.toLowerCase())) {
                                                            return true
                                                        }
                                                    }
                                                }

                                            })

                                        }}

                                        checkBoxDisabledFunction={(identifier: any) => {
                                            const product = products.find((product) => product.medien_id === identifier)
                                            if (product.verfügbar < selectedUsersId.length) return true
                                        }}
                                        checkBoxDisabledMessage={
                                            "Die Anzahl der verfügbaren Lizenzen ist geringer als die Anzahl der ausgewählten Nutzer."
                                        }
                                        trigger={mediumtrigger}
                                        setTrigger={setMediumTrigger}
                                    />
                                </div>


                            </div>
                        }

                        {
                            stepper === 2 && <div className="w-full flex-1 flex flex-col">
                                <p
                                    className="mt-[30px] font-bold text-[#404045] text-[20px] "
                                >
                                    4. Lizenzen auswählen
                                </p>
                                <div
                                    className="w-full bg-white flex-1 flex"
                                >
                                    <TableComponent
                                        data={licenses.filter((license) => license.medien_id === selectedMedia && !licenseAssignments.find((assignment) => assignment.inheritFrom === license.lizenz_id)).slice(0, selectedUsersId.length)}
                                        header={[
                                            { label: 'Lizenz_id', id: 'lizenz_id', disabled: true },
                                            { label: 'Lizenz-Code', id: 'lizenzcode' },
                                            { label: 'Medien ID', id: 'medien_id' },
                                            { label: 'Verlag', id: 'verlag' },
                                            { label: 'Lizenztyp', id: 'lizenztyp' },
                                            { label: 'Max Nutzer', id: 'lizenzanzahl' },
                                            { label: 'Zugewiesen', id: 'zugewiesen' },
                                            { label: 'Verfügbar', id: 'verfügbar' }
                                        ]}
                                        onChangeCheckBox={(identifiers: any[]) => {
                                            // setSelectedLicenses(identifiers)
                                        }}
                                        checkBoxDisabledFunction={(identifier: any) => {
                                            return true;
                                            // const license = licenses.find((license) => license.lizenz_id === identifier)
                                            // if (license.verfügbar === 0) return true

                                        }}
                                        checkBoxCheckedFunction={(identifier: any) => {
                                            return true;
                                            // const license = licenses.find((license) => license.lizenz_id === identifier)
                                            // if (license.verfügbar === 0) return true
                                        }}
                                        checkbox={true}
                                        // singleCheckBox={true}
                                        identifier={'lizenz_id'}
                                    />
                                </div>


                            </div>
                        }






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
                    disabled={
                        (stepper === 0 && !validStepOne)
                        ||
                        (stepper === 1 && !validStepTwo)


                    }
                    onClick={() => {
                        if (stepper < 4) {
                            setStepper(stepper + 1)
                        }
                    }}
                >
                    {stepper === 2 ? 'Zuweisen' : 'Weiter'}

                </Button>
            </div>
        </div>
    )
}