import axios from 'axios'
import { LicenseDefinitionModel } from 'license_manager'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
    licenseDefinitions: (LicenseDefinitionModel & { metadata: any })[][],
    licenseAssignments: LicenseDefinitionModel[],
    fetchLicenseDefinitions: () => any,
    fetchLicenseAssignments: () => any,
    users: any[],
    groups: any[],
    fetchUsers: () => any,
    fetchGroups: () => any,
    createLicenseAssignment: (licenseDefinitionID: string, targetID: string) => any,
    deleteLicenseAssignment: (licenseAssignmentID: string) => any,
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
}

export const useStore = create<State>()(
    persist(
        (set, get, props) => ({
            licenseDefinitions: [],
            licenseAssignments: [],
            fetchLicenseDefinitions: async () => {
                const resp = await axios(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/license_manager/licenseDefinitions`)
                let data = resp.data
                const volLizenzen = data.filter((item: any) => item.permissions[0].constraints.find((item: any) => {
                    return item.rightoperand === 'Volumenlizenz'
                }))
                data = data.filter((item: any) => item.permissions[0].constraints.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/purpose' && item.rightoperand !== 'Volumenlizenz')).map(
                    (item: any) => ([item])
                )


                const volumenMapper: any = {}

                for (const vol of volLizenzen) {
                    const constraints = vol.permissions[0].constraints
                    const product_id = vol.permissions[0].target
                    const kaufreferenz = constraints.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/eq').rightoperand
                    if (!volumenMapper[kaufreferenz + product_id]) {
                        volumenMapper[kaufreferenz + product_id] = [
                            vol
                        ]
                    } else {
                        volumenMapper[kaufreferenz + product_id].push(vol)
                    }
                }

                for (const key in volumenMapper) {
                    data.push(volumenMapper[key])
                }

                for (const el of data) {
                    const ele = el[0]
                    const product_id = ele.permissions[0].target
                    const resp = await axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/metadata_manager/${product_id}`)
                    ele.metadata = resp.data.data.lom
                }


                set({ licenseDefinitions: data })
            },
            fetchLicenseAssignments: async () => {
                const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments`)
                set({ licenseAssignments: resp.data })
            },
            users: [],
            groups: [],
            fetchUsers: async () => {
                const resp = await axios(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/users`)
                set({ users: resp.data })
                get().fetchGroups()
            },
            fetchGroups: async () => {
                const resp = await axios(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/groups`)
                set({ groups: resp.data })
            },
            createLicenseAssignment(licenseDefinitionID: string, targetID: string) {
                axios.post(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments`, {
                    licenseDefinitionID,
                    targetID
                }).then(async () => {
                    get().fetchLicenseAssignments()
                })
            },
            deleteLicenseAssignment(licenseAssignmentID: string) {
                axios.delete(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments/${licenseAssignmentID}`).then(async () => {
                    get().fetchLicenseAssignments()
                })
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