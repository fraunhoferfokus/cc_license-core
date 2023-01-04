
import { LicenseDefinitionDAO as NotificationDAO, LicenseDefinitionModel } from "license_manager";

const TABLE_NAME = 'notifications';


export default new NotificationDAO(TABLE_NAME, LicenseDefinitionModel);