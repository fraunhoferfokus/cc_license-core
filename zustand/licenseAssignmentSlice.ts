import { Policy } from 'license_manager';
import { create, StateCreator } from 'zustand'
import { MergedState } from './store';
import axios from 'axios';


export interface LicenseAssignmentState {
    fetchLicenseAssignments: () => any,
    createLicenseAssignment: (licenseDefinitionID: string, targetID: string) => any,
    deleteLicenseAssignment: (licenseAssignmentID: string) => any,
    licenseAssignments: Policy[],
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
                get().fetchLicenseAssignments()
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
            const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments`)
            set({ licenseAssignments: resp.data })


        },
        licenseAssignments: []
    }))