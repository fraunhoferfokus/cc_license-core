import axios from 'axios';
import { Policy } from 'license_manager';
import { ActionObject, Constraint } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2';
import { create, StateCreator } from 'zustand'
import { GeneralState, MergedState } from './store';


export type PolicyWithMetadata = Policy & { metadata: any }

export interface LicenseDefinitionState {
    fetchLicenseDefinitionsV2: any;
    licenseDefinitions: (Policy & { metadata: any })[][]
}

export const licenseDefinitionSlice: StateCreator<
    MergedState,
    [],
    [],
    LicenseDefinitionState
>
    = ((set, get) =>
    ({
        fetchLicenseDefinitionsV2: async () => {
            const resp = await axios(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/license_manager/licenseDefinitions`,
                {
                    withCredentials: true,
                }
            )
            let data: Policy[] = resp.data

            const groupMapper = new Map<string, Policy[]>()
            data.filter((item) => {
                const actionObject = (item.action![0] as ActionObject)
                const constraints: Constraint[] = actionObject.refinement! as Constraint[]
                return constraints.find((item) => item.uid === 'lizenztyp' && item.rightOperand === 'Volumenlizenz')
            }).forEach((vol) => {
                const prouct_id = vol.target
                const constraints = (vol.action![0] as ActionObject).refinement as Constraint[]
                const kaufreferenz = constraints.find((item) => item.uid === 'kaufreferenz')!.rightOperand
                const group = groupMapper.get(kaufreferenz + prouct_id) || []
                group.push(vol)
                groupMapper.set(kaufreferenz + prouct_id, group)
            })

            const volLizenzen = Array.from(groupMapper.values())
            const notVolLizenzen: [Policy][] = data.filter((item) => {
                const actionObject = (item.action![0] as ActionObject)
                const constraints: Constraint[] = actionObject.refinement! as Constraint[]
                return !constraints.find((item) => item.uid === 'lizenztyp' && item.rightOperand === 'Volumenlizenz')
            }).map((item) => ([item]))

            const product_ids = []
            const groupedLicenses = [...volLizenzen, ...notVolLizenzen]

            for (const lizenz of groupedLicenses) {
                const product_id = lizenz[0].target
                product_ids.push({ id: product_id })
            }

            if (data.length) {
                const resp2 = await axios.post(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/metadata_manager/getMetadataById`,
                    product_ids
                    ,
                    {
                        withCredentials: true,

                    }
                )
                for (let i = 0; i < resp2.data.length; i++) {
                    let ele: any = notVolLizenzen[i][0]
                    let metadata = resp2.data[i].data.lom
                    ele.metadata = metadata
                }
            }
            set({ licenseDefinitions: groupedLicenses as (Policy & { metadata: any })[][] })
        },
        licenseDefinitions: []
    }))

