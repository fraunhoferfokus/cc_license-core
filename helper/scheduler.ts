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
import LicenseAssignmentDAO from '../express/models/LicenseAssignmentDAO'
import NotificationDAO from '../express/models/NotificationDAO'
import { LicenseDefinitionDAO, LicenseDefinitionModel, LicenseInformationDAO, LicenseInformationModel, Policy } from 'license_manager'
import schedule from 'node-schedule'

const definitionDAOInstance = new LicenseDefinitionDAO('licenseDefinitions', Policy)
const licenseInformationDAOInstance = LicenseInformationDAO
const notificationDAOInstance = NotificationDAO
const assignmentDAOInstance = LicenseAssignmentDAO

export function scheduleEveryDay() {
    console.info('-------Setting up Scheduler ---------')
    const job = schedule.scheduleJob('0 0 * * *', async () => {
        const date = new Date()
        console.info('-----------------')
        console.info(`Deleting on: ${('0' + date.getDate().toString()).slice(-2)}-${('0' + date.getMonth().toString()).slice(-2)} ${date.getHours()}:${date.getMinutes()}`)
        const [definitions, assignments, informations, notifications] = await Promise.all([
            definitionDAOInstance.findAll(),
            assignmentDAOInstance.findAll(),
            licenseInformationDAOInstance.findAll(),
            notificationDAOInstance.findAll()
        ])

        const deleteOperations: Promise<any>[] = []
        for (const definition of definitions) {
            deleteOperations.push(definitionDAOInstance.deleteById(definition._id))
        }

        for (const assignment of assignments) {
            deleteOperations.push(assignmentDAOInstance.deleteById(assignment._id))
        }
        for (const information of informations) {
            deleteOperations.push(licenseInformationDAOInstance.deleteById(information._id))
        }

        for (const notification of notifications) {
            deleteOperations.push(notificationDAOInstance.deleteById(notification._id))
        }


        try {
            await Promise.all(deleteOperations)
            console.info('succesfully deleted all dependencies')

            console.info('-----------------')

        } catch (err) {
            console.error(err)
            console.error('some error occured')
        }
    })

}
