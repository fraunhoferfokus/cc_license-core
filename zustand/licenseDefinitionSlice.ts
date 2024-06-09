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
import axios from 'axios';
import { Policy } from 'license_manager';
import { ActionObject, Constraint } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2';
import { create, StateCreator } from 'zustand'
import { GeneralState, MergedState } from './store';


export type PolicyWithMetadata = Policy & { metadata: any }

export interface LicenseDefinitionState {
    fetchLicenseDefinitionsV2: any;
    licenseDefinitions: (Policy & { metadata: any })[][],
    licensesLoading: boolean
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
            set({ licensesLoading: true })
            const resp = await axios(`${process.env.NEXT_PUBLIC_SELF_URL}/licenseDefinitions`,
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
                const resp2 = await axios.post(`${process.env.NEXT_PUBLIC_METADATA_MANAGER_URL}/getMetadataById`,
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
            set({ licenseDefinitions: groupedLicenses as (Policy & { metadata: any })[][], licensesLoading: false })
        },
        licensesLoading: true,
        licenseDefinitions: []
    }))

