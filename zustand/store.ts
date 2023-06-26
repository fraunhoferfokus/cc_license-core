import axios from 'axios'
import { LicenseDefinitionModel, Policy } from 'license_manager'
import { Constraint } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2'
import { ActionObject, ActionVerb } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { LicenseDefinitionState, licenseDefinitionSlice } from './licenseDefinitionSlice'
import { LicenseAssignmentState, licenseAssignmentSlice} from './licenseAssignmentSlice'

export interface GeneralState {
    fetchLicenseDefinitionsV2: () => any,
    
    users: any[],
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

}

export type MergedState = GeneralState & LicenseDefinitionState & LicenseAssignmentState

export const useStore = create<MergedState>()(
    persist(
        (set, get, props) => ({
            ...licenseDefinitionSlice(set, get, props),
            ...licenseAssignmentSlice(set, get, props),
            config: null,
         
            users: [],
            groups: [],
            fetchUsersAndGroups: async () => {
                const config = get().config
                const resp = await axios(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/users`, { withCredentials: true })
                const resp2 = await axios(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/groups`, { withCredentials: true })
                set({ groups: resp2.data, users: resp.data })
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