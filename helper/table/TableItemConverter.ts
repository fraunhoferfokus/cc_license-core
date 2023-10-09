


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

        let lizenzcode = license.uid.split('/').pop()
        let lizenztyp = license.action![0].refinement.find((item: any) => item.uid === 'lizenztyp')?.rightOperand

        return {
            lizenz_id: license.uid,
            lizenzcode,
            medien_id,
            medium,
            verlag,
            lizenztyp,
            max_nutzer,
            zugewiesen,
            verfügbar,
        }
    }


}