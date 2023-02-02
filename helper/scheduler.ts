import LicenseAssignmentDAO from '../express/models/LicenseAssignmentDAO'
import { LicenseDefinitionDAO, LicenseDefinitionModel } from 'license_manager'
import schedule from 'node-schedule'

const definitionDAOInstance = new LicenseDefinitionDAO('licenseDefinitions', LicenseDefinitionModel)
const assignmentDAOInstance = LicenseAssignmentDAO

export function scheduleEveryDay() {
    console.log('-------Setting up Scheduler ---------')
    const job = schedule.scheduleJob('0 0 * * *', async () => {
        const date = new Date()
        console.log('-----------------')
        console.log(`Deleting on: ${('0' + date.getDate().toString()).slice(-2)}-${('0' + date.getMonth().toString()).slice(-2)} ${date.getHours()}:${date.getMinutes()}`)
        const [definitions, assignments] = await Promise.all([
            definitionDAOInstance.findAll(),
            assignmentDAOInstance.findAll()
        ])

        const deleteOperations: Promise<any>[] = []
        for (const definition of definitions) {
            deleteOperations.push(definitionDAOInstance.deleteById(definition._id))
        }

        for (const assignment of assignments) {
            deleteOperations.push(assignmentDAOInstance.deleteById(assignment._id))
        }

        try {
            await Promise.all(deleteOperations)
            console.log('succesfully deleted all dependencies')

            console.log('-----------------')

        } catch (err) {
            console.error(err)
            console.error('some error occured')
        }
    })

}
