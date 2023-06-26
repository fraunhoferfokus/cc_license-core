import { Policy } from "license_manager"
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2"



export const toBILO = (license?: Policy) => {
    if(!license) return null

    console.log({license})

    const constraints = (license.action![0] as ActionObject).refinement as Constraint[]
    const one = constraints.find((item) => item.uid === 'gueltigkeitsbeginn')!.rightOperand!
    const two = constraints.find((item) => item.uid === 'gueltigkeitsende')!.rightOperand!

    let gueltigkeitsbeginn = new Date(one)
    let gueltigkeitsende = new Date(two)
    let anzahl = constraints.find((item) => item.uid === 'lizenzanzahl')!.rightOperand!
    let gueltigkeitsdauer = constraints.find((item) => item.uid === 'gueltigkeitsdauer')!.rightOperand!
    let nutzungssysteme = constraints.find((item) => item.uid === 'nutzungssysteme')!.rightOperand!
    let lizenztyp = constraints.find((item) => item.uid === 'lizenztyp')!.rightOperand!
    let kaufreferenz = constraints.find((item) => item.uid === 'kaufreferenz')!.rightOperand!
    let sonderlizenz = constraints.find((item) => item.uid === 'sonderlizenz')?.rightOperand!
    let productid = license.target

    return {
        sonderlizenz,
        lizenzanzahl: anzahl ? parseInt(anzahl) : 0,
        gueltigkeitsbeginn:
            gueltigkeitsbeginn.getDate() ? gueltigkeitsbeginn.getDate() + '-' + (gueltigkeitsbeginn.getMonth() + 1) + '-' + gueltigkeitsbeginn.getFullYear() : '',
        gueltigkeitsende:
            gueltigkeitsende.getDate() ? gueltigkeitsende.getDate() + '-' + (gueltigkeitsende.getMonth() + 1) + '-' + gueltigkeitsende.getFullYear() : ''
        ,
        gueltigkeitsdauer: parseInt(gueltigkeitsdauer),
        nutzungssysteme,
        lizenztyp,
        kaufreferenz,
        productid,
    }

}