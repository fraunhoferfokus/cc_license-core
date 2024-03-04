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
import { Policy } from 'license_manager';
import { create, StateCreator } from 'zustand'
import { MergedState } from './store';
import axios from 'axios';


export interface LicenseAssignmentState {
    fetchLicenseAssignments: () => any,
    createLicenseAssignment: (licenseDefinitionID: string, targetID: string) => any,
    deleteLicenseAssignment: (licenseAssignmentID: string) => any,
    licenseAssignments: Policy[],
    setPickedUserIds: (userIds: string[]) => any,
    pickedUserIds: string[],
    setStepper: (step: number) => any,
    stepper: number,
    pickedLicenseType: string,
    setPickedLicenseType: (licenseType: string) => any,
    pickedMedium: string,
    setPickedMedium: (medium: string) => any,
}

export const licenseAssignmentSlice: StateCreator<MergedState,
    [],
    [],
    LicenseAssignmentState> = ((set, get) => ({
        createLicenseAssignment(licenseDefinitionID: string, targetID: string) {
            axios.post(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments`, {
                licenseDefinitionID,
                targetID
            },
            ).then(async () => {
                get().setToastProps('Lizenz wurde zugewiesen', 'success')
                get().fetchLicenseAssignments()
            }).catch((err) => {
                get().setToastProps('Lizenz konnte nicht zugewiesen werden', 'error')
            })
        },

        deleteLicenseAssignment(licenseAssignmentID: string) {
            axios.delete(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments/${licenseAssignmentID}`, {
                withCredentials: true
            }).then(async () => {
                get().fetchLicenseAssignments()
            })
        },
        fetchLicenseAssignments: async () => {
            const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments`, {

            })
            set({ licenseAssignments: resp.data })
        },
        licenseAssignments: [],
        setPickedUserIds(userIds: string[]) {
            set({ pickedUserIds: userIds })
        },
        pickedUserIds: [],
        setStepper(step: number) {
            set({ stepper: step })
        },
        stepper: 0,
        pickedLicenseType: 'Einzellizenz',
        setPickedLicenseType(licenseType: string) {
            set({ pickedLicenseType: licenseType })
        },
        pickedMedium: '',
        setPickedMedium(medium: string) {
            set({ pickedMedium: medium })
        }
    }))