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