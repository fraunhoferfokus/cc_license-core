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
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2"



export const toBILO = (license?: Policy) => {
    if(!license) return null
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

