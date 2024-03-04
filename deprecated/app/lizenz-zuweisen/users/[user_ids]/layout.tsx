/* -----------------------------------------------------------------------------
 *  Copyright (c) 2023, Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.   
 *
 *  No Patent Rights, Trademark Rights and/or other Intellectual Property 
 *  Rights other than the rights under this license are granted. 
 *  All other rights reserved.
 *
 *  For any other rights, a separate agreement needs to be closed.
 * 
 *  For more information please contact:   
 *  Fraunhofer FOKUS
 *  Kaiserin-Augusta-Allee 31
 *  10589 Berlin, Germany 
 *  https://www.fokus.fraunhofer.de/go/fame
 *  famecontact@fokus.fraunhofer.de
 * -----------------------------------------------------------------------------
 */
"use client"

import { TextField } from "@mui/material"
import { usePathname } from "next/navigation"
import React, { ReactNode, useEffect, useState } from "react"
import { useStore } from "../../../../../zustand/store"
import FunctionButton from "../../../components/Buttons/FunctionButton"
import TableComponent from "../../../components/Table/TableComponent"
import { transformUserToData } from "../../../components/Table/UserGroupTable"

export default function LizenzUserLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: {
        user_ids: string
    }
}) {

    const pathName = usePathname()
    const { licenseDefinitions, licenseAssignments, users, setSelectedMedia, setSelectedUserIds, loadingUsers, licensesLoading } = useStore(state => state)
    const selectedUserIds = decodeURIComponent(params.user_ids)?.split(',')
    let picked_users = users.filter((item) => selectedUserIds.includes(item.id)).map((user) => (transformUserToData(user)))
    const [stepper, setStepper] = useState(1)
    const [medium_value, set_medium_value] = useState('')
    const [mediumtrigger, setMediumTrigger] = useState(false)


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
        let lizenztyp = license.action![0].refinement.find((item) => item.uid === 'lizenztyp')?.rightOperand
        let verfügbar

        switch (lizenztyp) {
            case 'Einzellizenz':
            case 'Volumenlizenz':
                verfügbar = licenseDefinitions.filter((item) => item[0].target === product_id).length - zugewiesen
                break;
        }





        let medium = license.metadata.general.title.value

        // get the last slash after splitting 
        let lizenzcode = license.uid.split('/').pop()


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


    useEffect(() => {
        // setSelectedUserIds(selectedUserIds)
    }, [selectedUserIds])

    // const childrenArray: any = React.Children.toArray(children);
    // const [selected_medium_table, pick_license_table] = childrenArray?.[0]?.props?.childProp?.current




    return (<>
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
                            // setPickedLicenseType('Einzellizenz')
                            // setLicenseModal(true)
                        }}
                        clicked={true}
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
                        data={picked_users ? picked_users : []}
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
                        loadingAmount={2}
                        isLoading={loadingUsers}
                    // onChangeCheckBox={(selected: any) => {
                    //     setSelectedUsers(selected)
                    // }}


                    />

                </div>


                {/* {children} */}


                {/* {stepper >= 2 &&

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
                    } */}

            </div>

            {
                !pathName?.includes('medium') && <div className="w-full flex-1 flex flex-col">
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
                            loadingAmount={2}
                            isLoading={licensesLoading}
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
                                if (product?.verfügbar < picked_users?.length) return true
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


            {/* {
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
                                data={licenses.filter((license) => license.medien_id === selectedMedia && !licenseAssignments.find((assignment) => assignment.inheritFrom === license.lizenz_id)).slice(0, picked_users.length)}
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
                } */}


            {children}



        </div>
    </>)



}