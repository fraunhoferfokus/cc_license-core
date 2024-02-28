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
