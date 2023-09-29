
import { LicenseDefinitionDAO as NotificationDAO, LicenseDefinitionModel, Policy } from "license_manager";

const TABLE_NAME = 'notifications';


export default new NotificationDAO(TABLE_NAME, Policy);