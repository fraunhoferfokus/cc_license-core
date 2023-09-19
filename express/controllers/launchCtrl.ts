import express from "express";
class LicenseAssignmentController {
    router: express.Router;

    constructor() {
        this.router = express.Router()
        this.configRouters()
    }

    configRouters() {}
    
}

export default new LicenseAssignmentController().router
