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
import axios from 'axios'
import { LicenseDefinitionModel, Policy } from 'license_manager'
import { Constraint } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2'
import { ActionObject, ActionVerb } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { LicenseDefinitionState, licenseDefinitionSlice } from './licenseDefinitionSlice'
import { LicenseAssignmentState, licenseAssignmentSlice } from './licenseAssignmentSlice'
import { SANIS_USER } from '../server'

const wait = (time: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}


export interface GeneralState {
    fetchLicenseDefinitionsV2: () => any,
    fetchDashboard: () => any,
    users: any[],
    loadingUsers: boolean,
    groups: any[],
    fetchUsersAndGroups: () => any,
    notification: {
        product_id: string | null,
        license_type: string | null,
        start_date: Date | null,
        end_date: Date | null,
        elapsed_time: number | null,
        count: number | null
    },
    setNotification: (obj: {
        product_id: string | null,
        license_type: string | null,
        start_date: Date | null,
        end_date: Date | null,
        elapsed_time: number | null,
        count: number | null
    }) => any,
    createNotification: (payload: any) => any,
    deleteNotification: (notficationID: string) => any,
    fetchNotifications: () => any,
    notifications: any[],
    config: any,
    toastProps: { message: string, severity: 'success' | 'error' | 'warning' | 'info', duration: number },
    setToastProps: (message: string, severity?: 'success' | 'error' | 'warning' | 'info', duration?: number) => any,
    selectedLicenseId: string | null,
    setSelectedLicenseIds: (ids: any[]) => any,
    selectedLicenseIds: string[],
    selectedMedia: any,
    setSelectedMedia: (media: any) => any,
    myself: SANIS_USER | null,
    fetchMyself: () => any,
    modalProps: {
        open: boolean
    },
    selectedUserIds: string[],
    setSelectedUserIds: (ids: string[]) => void,
    setModalProps: (props: any) => void
}

export type MergedState = GeneralState & LicenseDefinitionState & LicenseAssignmentState

export const useStore = create<MergedState>()(
    persist(
        (set, get, props) => ({
            fetchDashboard: async () => {
                get().fetchLicenseDefinitionsV2()
                
                await wait(300)
                get().fetchMyself()
                await wait(300)
                get().fetchLicenseAssignments()
                await wait(300)
                get().fetchUsersAndGroups()
            },
            loadingUsers: true,
            selectedUserIds: [],
            selectedLicenseIds: [],
            setSelectedUserIds: (ids: string[]) => {
                set({ selectedUserIds: ids })
            },
            modalProps: {
                open: false
            },
            setModalProps: (props: any) => {
                set({ modalProps: props })
            },
            myself: null,
            fetchMyself: async () => {
                const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/user-info`, { withCredentials: true })
                set({
                    myself: resp.data
                })
            },

            selectedLicenseId: null,
            setSelectedLicenseIds: (ids: any[]) => {
                set({ selectedLicenseIds: ids })
            },
            selectedMedia: '',
            setSelectedMedia: (media: any) => {
                set({ selectedMedia: media })
            },
            ...licenseDefinitionSlice(set, get, props),
            ...licenseAssignmentSlice(set, get, props),
            config: null,
            toastProps: { message: '', severity: 'success', duration: 3000 },
            setToastProps: (message: string, severity = 'success', duration = 3000) => {
                set({
                    toastProps: {
                        ...get().toastProps,
                        message,
                        severity,
                        duration
                    }
                })
            },
            users: [],
            groups: [],
            fetchUsersAndGroups: async () => {
                const config = get().config
                set({ loadingUsers: true })
                const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/users`, { withCredentials: true })
                const resp2 = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/groups`, { withCredentials: true })
                set({ groups: resp2.data, users: resp.data, loadingUsers: false })
                return new Promise((resolve) => resolve(true))
            },

            notification: {
                product_id: null,
                license_type: null,
                start_date: null,
                end_date: null,
                elapsed_time: null,
                count: null
            },
            setNotification: (obj) => {
                set({ notification: obj })
            },
            createNotification(payload: any) {
                axios.post(`${process.env.NEXT_PUBLIC_SELF_URL}/notifications`, payload).then(async () => {
                    get().fetchNotifications()
                })
            },
            deleteNotification(notficationID: string) {
                axios.delete(`${process.env.NEXT_PUBLIC_SELF_URL}/notifications/${notficationID}`).then(async () => {
                    get().fetchNotifications()
                })
            },
            fetchNotifications: async () => {
                const data = (await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/notifications`)).data

                set({ notifications: data })
            },
            notifications: []
        }),
        {
            name: 'license-storage',
            partialize: (state) => ({ notifications: state.notifications }),
        }
    )
)