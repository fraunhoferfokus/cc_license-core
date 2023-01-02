import { unstable_useId } from "@mui/material";
import axios from "axios";
import express from "express";
import { LicenseDefinitionModel } from "license_manager";
import next from "next";
import LicenseAssignmentDAO from "../models/LicenseAssignmentDAO";
import { v4 as uuid } from 'uuid'


class LicenseAssignmentController {

    router: express.Router;

    constructor() {
        this.router = express.Router()
        this.configRouters()
    }

    configRouters() {
        this.router.get('/', this.getLicenseAssignments);
        this.router.get('/:id', this.getLicenseAssignment);
        this.router.post('/', this.createLicenseAssignment);
        this.router.delete('/:id', this.deleteLicenseAssignment);
    }

    getLicenseAssignments: express.Handler = async (req, res, next) => {
        try {
            const licenseAssignments = await LicenseAssignmentDAO.findAll()
            return res.json(licenseAssignments)
        } catch (err: any) {
            return res.status(err?.response?.statusCode || 500).json(err)
        }
    }

    getLicenseAssignment: express.Handler = async (req, res, next) => {
        try {
            const licenseAssignment = await LicenseAssignmentDAO.findById(req.params.id)
            return res.json(licenseAssignment)
        } catch (err: any) {

            return res.status(err?.response?.statusCode || 500).json(err)
        }
    }

    createLicenseAssignment: express.Handler = async (req, res, next) => {
        try {
            console.log('creating happy')
            const { licenseDefinitionID, targetID } = req.body

            const licenseDefinition: LicenseDefinitionModel = (await axios.get(`${licenseDefinitionID}`)).data
            const licenseAssignments = await LicenseAssignmentDAO.findAll()

            // check if licenseDefinition is a for group or for user
            const permissions = licenseDefinition.permissions!
            const licenseType = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/purpose')!.rightoperand
            
            console.log(licenseDefinition.permissions![0].constraints)
            const amount = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/count')!.rightoperand
            const role = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/recipient')?.rightoperand
            const assigner = permissions[0].assigner


            const unique_id = uuid()
            const toBeCreated = new LicenseDefinitionModel({
                _id: unique_id,
                inheritfrom: licenseDefinitionID,
                policyid: unique_id,
                policytype: "http://www.w3.org/ns/odrl/2/Ticket",
                permissions: [{
                    action: "http://www.w3.org/ns/odrl/2/use",
                    assigner,
                    assignee: targetID,
                    target: licenseDefinitionID,
                    constraints: [
                        {
                            name: "http://www.w3.org/ns/odrl/2/event",
                            operator: "http://www.w3.org/ns/odrl/2/eq",
                            rightoperand: "deactivated"
                        }
                    ]
                }]

            })


            switch (licenseType) {
                case 'Einzellizenz':
                    const found = licenseAssignments.find((assignment) => assignment.inheritfrom === licenseDefinitionID)
                    const user = (await axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/users/${targetID}`)).data
                    if (found) return res.status(400).json({ message: 'Single-License already assigned' })
                    if (role && !user.gruppen.find((gruppe: any) => gruppe.rolle === role)) {
                        return res.status(400).json({ message: 'User has no role to use this license' })
                    }
                    await LicenseAssignmentDAO.create(toBeCreated)
                    break;
                case 'Volumenlizenz':

                    break;
                case 'Gruppenlizenz':
                    break;
            }


            return res.status(204).send()
        } catch (err: any) {
            console.log(err)
            return res.status(err?.response?.statusCode || 500).json(err)
        }
    }

    deleteLicenseAssignment: express.Handler = async (req, res, next) => {
        try {
            const licenseAssignment = await LicenseAssignmentDAO.findById(req.params.id)
            const licenseDefinition: LicenseDefinitionModel = (await axios.get(`${licenseAssignment.inheritfrom}`)).data
            const permissions = licenseDefinition.permissions!
            const licenseType = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/purpose')!.rightoperand
            const amount = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/amount')!.rightoperand
            const role = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/recipient')?.rightoperand
            const assigner = permissions[0].assigner

            switch (licenseType) {
                case 'Einzellizenz':
                    if (licenseAssignment!.permissions![0].constraints!.find((constraint) => constraint.rightoperand === 'activated')) {
                        return res.status(400).json({ message: 'License is already activated and cannot be deleted...' })
                    }
                    await LicenseAssignmentDAO.deleteById(req.params.id)
                    break;
                case 'Volumenlizenz':

                    break;
                case 'Gruppenlizenz':
                    break;
            }

            return res.status(204).send()

        } catch (err: any) {
            return res.status(err?.response?.statusCode || 500).json(err)
        }
    }
}

export default new LicenseAssignmentController().router
