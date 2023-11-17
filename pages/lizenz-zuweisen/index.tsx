import { Button, TextField } from "@mui/material";
import { Policy } from "license_manager";
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2";
import React, { useEffect, useRef, useState } from "react";

import TableComponent from "../components/Table/TableComponent";
import UserGroupTable, { transformUserToData } from "../components/Table/UserGroupTable";
import { useRouter } from "next/router";
// import { usePathname, useParams } from 'next/navigation'
import { PolicyWithMetadata } from "../../zustand/licenseDefinitionSlice";
import { toBILO } from "../../helper/helper";

import { useStore } from "../../zustand/store";
import FunctionButton from "../components/FunctionButton";
import RootLayout from "../components/Rooutlayout";


export default function LizenzLayout({ children, currentlySelectedMedium }: { children: any, currentlySelectedMedium?: string }) {
    // const params = useParams()

    // const paths = usePathname()?.split('/')
    const router = useRouter()
    const currentPath = router.pathname
    let mediumId = router.query.mediumId || ''
    let userIds = router.query.userId || ''

    const {
        licenseDefinitions,
        users,
        // stepper,
        setStepper,
        licenseAssignments,
        pickedLicenseType,
        setPickedLicenseType,
        createLicenseAssignment,
        myself,
        licensesLoading,
        loadingUsers
    } = useStore(state => state)

    const [pickedLicenses, setPickedLicenses] = useState<PolicyWithMetadata[]>([])
    const [mediumtrigger, setMediumTrigger] = useState(false)
    const [pickedSelect, setPickedSelect] = useState('placeholder')
    const [checkedUserIds, setCheckedUserIds] = useState<any>([])
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


    let validStepOne = checkedUserIds.length > 0

    let validStepTwo = currentlySelectedMedium ? true : false


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
    let [medium_value, set_medium_value] = useState('')


    useEffect(() => {
        setMediumTrigger(true)
    }, [medium_value])


    useEffect(() => {
        console.log(checkedUserIds)
    }, [checkedUserIds])

    let picked_users = users.filter((user) => checkedUserIds.includes(user.id)).map((user) => (transformUserToData(user)))

    let org = myself?.personenkontexte[0]?.organisation

    return (
        <RootLayout>
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
                    currentPath === '/lizenz-zuweisen' &&
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

                                    }}
                                    clicked={pickedLicenseType === 'Volumenlizenz'}
                                    color="#F9F3C4"
                                />

                                <FunctionButton
                                    infoText={'Nur Selektion einer Klasse oder Lerngruppe möglich'}
                                    buttonTitle={'Lerngruppenlizenz'}
                                    iconPath={'/map.svg'}
                                    callback={() => {
                                        setPickedLicenseType('Lerngruppenlizenz')
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
                            {

                                <UserGroupTable
                                    onChangedUsers={(selectedUserIds) => {

                                        setCheckedUserIds(selectedUserIds)
                                    }}
                                    users={pickedLicenseType === 'Einzellizenz' ? users : []}
                                    onChangedGroups={(groups) => { }}
                                />}



                        </div>
                    </>

                }


                {children}


                <div
                    className="self-end mt-[20px] flex justify-between w-[100%]"
                >

                    {
                        currentPath !== '/lizenz-zuweisen' ?
                            <Button
                                variant="contained"
                                onClick={() => {
                                    // setStepper(stepper - 1)
                                    router.back()
                                }}
                            >
                                Zurück

                            </Button> :
                            <div></div>
                    }



                    <Button
                        variant="contained"
                        disabled={
                            (currentPath === '/lizenz-zuweisen' && !validStepOne)
                            ||
                            (currentPath === '/lizenz-zuweisen/users/[userId]' && !validStepTwo)
                            ||
                            licensesLoading
                            ||
                            loadingUsers

                        }
                        onClick={() => {
                            console.log('stepper', currentPath)
                            if (currentPath === '/lizenz-zuweisen') {
                                router.push(`/lizenz-zuweisen/users/${checkedUserIds.join(',')}`)
                            }
                            if (currentPath === '/lizenz-zuweisen/users/[userId]') {
                                router.push(`/lizenz-zuweisen/users/${userIds}/medium/${currentlySelectedMedium}`)
                            }

                            if (currentPath === '/lizenz-zuweisen/users/[userId]/medium/[mediumId]') {
                                // let userIds = (decodeURIComponent(params?.user_ids as string))?.split(',')
                                // let medien_id = decodeURIComponent(params?.medium_id as string || '')
                                let availableLicenses = licenseDefinitions?.filter((grouped_license) => {
                                    let license = grouped_license[0]
                                    let found = licenseAssignments.find((item) => item.inheritFrom === license._id)
                                    return license.target === mediumId && !found
                                }).map((arr) => arr[0]._id)


                                let userIdArr = (userIds as string).split(',')
                                for (let i = 0; i < userIdArr?.length; i++) {
                                    createLicenseAssignment(availableLicenses[i], userIdArr[i])
                                }
                                setPickedLicenseType('Einzellizenz')
                                router.push('/lizenz-zuweisen')

                            }
                        }}
                    >
                        {currentPath === '/lizenz-zuweisen/users/[userId]/medium/[mediumId]' ? 'Zuweisen' : 'Weiter'}

                    </Button>
                </div>
            </div>
        </RootLayout>
    )
}