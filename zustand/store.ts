import create from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
    licenseDefinitions: any[],
    licenseAssignment: any[],
    fetchLicenseDefinitions: () => any
    fetchLicenseAssignments: () => any
}

export const store = create<State>()(
    persist(
        (set, get, props) => ({
            licenseDefinitions: [],
            licenseAssignment: [],
            fetchLicenseDefinitions: async () => {
                
            },
            fetchLicenseAssignments: async () => {

            },


        }),
        {
            name: 'license-storage',
        }
    )
)