
import { LicenseDefinitionDAO, LicenseDefinitionModel } from "license_manager";

const TABLE_NAME = 'license_assignments';


export default new LicenseDefinitionDAO(TABLE_NAME, LicenseDefinitionModel);