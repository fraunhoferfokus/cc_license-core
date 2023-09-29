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
            }).catch((err) =>{
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
            const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/license-assignments`)
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