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
import { Policy } from "license_manager"
import { PolicyWithMetadata } from "../../zustand/licenseDefinitionSlice"



export default class TableTransformer {

    static transformToLicenseRow(license: any, licenseAssignments: any[], licenseDefinitions: any[]) {
        let product_id = license.target
        let metadata = license.metadata
        let max_nutzer = license.action![0].refinement.find((item: any) => item.uid === 'lizenzanzahl')?.rightOperand
        let medien_id = metadata.general.identifier
        let verlag = license.assignee
        let zugewiesen = licenseAssignments.filter((item) => item.target === product_id).length
        let verfügbar = licenseDefinitions.filter((item) => item[0].target === product_id).length - zugewiesen
        let medium = license.metadata.general.title.value

        let action = license.action![0]
        let refinement = action.refinement
        let lizenzcode = refinement.find((item: any) => item.uid === 'lizenzcode')?.rightOperand

        let lizenztyp = license.action![0].refinement.find((item: any) => item.uid === 'lizenztyp')?.rightOperand

        return {
            lizenz_id: license.uid,
            lizenzcode: lizenzcode?.includes(verlag) ? lizenzcode : `${verlag}-${lizenzcode}`,
            medien_id,
            medium,
            verlag,
            lizenztyp,
            max_nutzer,
            zugewiesen,
            verfügbar,
        }
    }

    static transformToLicenseAssingmentRow(assignment: Policy, users: any[], licenseDefinitions: PolicyWithMetadata[][]) {
        const assignee = assignment.assignee
        let user = users.find((item) => {


            return item.id === assignee
        })

        let vorname = user?.firstName
        let nachname = user?.lastName
        let lizenzcode = assignment.action![0].refinement.find((item: any) => item.uid === 'lizenzcode')?.rightOperand
        let medien_id = assignment.target

        const licenseDefinition = licenseDefinitions.find((item: any) => assignment.inheritFrom === item[0]?.uid)?.[0]
        let medium = licenseDefinition?.metadata?.general?.title?.value
        let verlag = licenseDefinition?.assignee
        let lizenztyp = licenseDefinition?.action![0]?.refinement.find((item: any) => item.uid === 'lizenztyp')?.rightOperand

        lizenzcode = lizenzcode?.includes(verlag as string) ? lizenzcode : `${verlag}-${lizenzcode}`


        let object = {
            userId: assignee,
            assignmentId: assignment.uid,
            lizenzId: licenseDefinition?.uid,
            vorname,
            nachname,
            lizenzcode,
            medien_id,
            medium,
            verlag,
            lizenztyp,
            verfügbar: 'Nein'
        }
        return object

    }


}