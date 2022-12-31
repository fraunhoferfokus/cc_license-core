import axios from 'axios'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
    licenseDefinitions: any[],
    licenseAssignment: any[],
    fetchLicenseDefinitions: () => any
    fetchLicenseAssignments: () => any
}

export const useStore = create<State>()(
    persist(
        (set, get, props) => ({
            licenseDefinitions: [],
            licenseAssignment: [],
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

            },


        }),
        {
            name: 'license-storage',
        }
    )
)