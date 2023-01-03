import { unstable_useId } from "@mui/material";
import axios from "axios";
import express from "express";
import { LicenseDefinitionModel } from "license_manager";
import next from "next";
import LicenseAssignmentDAO from "../models/LicenseAssignmentDAO";
import { v4 as uuid } from 'uuid'
import { userAgent } from "next/server";


class LicenseAssignmentController {

    router: express.Router;

    constructor() {
        this.router = express.Router()
        this.configRouters()
    }

    configRouters() {
        this.router.post('/', this.launchLicenseAssignment)
    }

    launchLicenseAssignment: express.Handler = async (req, res, next) => {
        try {
            console.log('req.body', req.body)

            // const metadataID = req.params.metadataID
            // TODO: later extract from access token of user!
            const userID = req.body.userID
            const licenseDefinitionID = req.body.licenseDefinitionID
            const licenseDefinition: LicenseDefinitionModel = (await axios.get(`${licenseDefinitionID}`)).data


            const licenseAssignments = await LicenseAssignmentDAO.findAll()
            const userLicense = licenseAssignments.find(((licenseAssignment) => licenseAssignment.inheritfrom === licenseDefinitionID && licenseAssignment.permissions![0].assignee === userID))


            const permissions = licenseDefinition.permissions!
            const lizenzanzahl = parseInt(permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/count')?.rightoperand!)
            const licenseType = permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/purpose')?.rightoperand



            if (!userLicense) {
                return res.status(404).send('Keine Lizenz für User und Lizenzdefinition gefunden')
            }

            const url = `${process.env.NEXT_PUBLIC_DEPLOY_URL}/metadata_manager/${permissions![0].target}`
            const metadata = (await axios.get(`${url}`)).data.data.lom

            // check if date is within license period
            const activationLowerBoundary = new Date(licenseDefinition?.permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime'
                && constraint.operator === 'http://www.w3.org/ns/odrl/2/gteq'
            )?.rightoperand!)
            const activationHigherBoundary = new Date(licenseDefinition?.permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime'
                && constraint.operator === 'http://www.w3.org/ns/odrl/2/lteq'
            )?.rightoperand!)

            const userPermissions = userLicense.permissions![0]!


            const today = new Date()
            let endDate = new Date()

            if (today < activationLowerBoundary || today > activationHigherBoundary) {
                return res.status(403).send(`Lizenz kann nicht geladen werden. Lizenzzeitraum ist von ${activationLowerBoundary} nis ${activationHigherBoundary}`)
            }


            switch (licenseType) {
                case 'Einzellizenz':
                case 'Volumenlizenz':
                    userPermissions.constraints = userPermissions.constraints?.filter((constraint) => constraint.name !== 'http://www.w3.org/ns/odrl/2/event')

                    // if already activated
                    const hatSession1 = userPermissions.constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime' &&
                        constraint.operator === 'http://www.w3.org/ns/odrl/2/lteq'
                    )?.rightoperand

                    if (hatSession1) {
                        const gueltigBis = new Date(hatSession1)
                        endDate = gueltigBis
                    } else {
                        // get elapsed time from definition
                        const elapsedTime = parseInt(permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/elapsedTime')?.rightoperand!)
                        // add days of elapsed time to today
                        endDate.setDate(today.getDate() + elapsedTime)
                        // check if endDate is bigger than activationHigherBoundary
                        if (endDate > activationHigherBoundary) {
                            endDate.setDate(activationHigherBoundary.getDate())
                        }
                    }
                    break;
                case 'Gruppenlizenz':
                    // get all license-assignments for this licensedefinition
                    const currAssignForDefinition = licenseAssignments.filter((assignment) => assignment.inheritfrom === licenseDefinition.policyid
                        &&
                        !assignment.permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/recipient')
                    )

                    // check if user currently in session via date
                    const hatSession = userPermissions.constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime' &&
                        constraint.operator === 'http://www.w3.org/ns/odrl/2/lteq'
                    )?.rightoperand

                    if (hatSession && (new Date(hatSession) > activationLowerBoundary && new Date(hatSession) < activationHigherBoundary)) {
                        console.log('skip license check')
                    } else {
                        console.log('check if user can acquire temp license')
                        // check if user can temp  license
                        const counter = currAssignForDefinition.filter((assignment) => {
                            // get date of assignment and check if it is within the activation period
                            const assignmentDate = new Date(assignment.permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/dateTime'
                                && constraint.operator === 'http://www.w3.org/ns/odrl/2/lteq'
                            )?.rightoperand!)

                            // this assignment is actiavted
                            if (today < assignmentDate) {
                                return true
                            }
                        }).length

                        if (counter >= lizenzanzahl) {
                            return res.status(403).send('Maximale Anzahl an Gleichzeitigen Lizenzen erreicht')
                        }
                    }

                    endDate.setDate(endDate.getDate() + 1)

                    if (endDate > activationHigherBoundary) {
                        endDate.setDate(activationHigherBoundary.getDate())
                    }
            }

            userPermissions.constraints = []

            userPermissions.constraints?.push({
                name: 'http://www.w3.org/ns/odrl/2/dateTime',
                operator: 'http://www.w3.org/ns/odrl/2/gteq',
                rightoperand: today.toISOString()
            })
            userPermissions.constraints?.push({
                name: 'http://www.w3.org/ns/odrl/2/dateTime',
                operator: 'http://www.w3.org/ns/odrl/2/lteq',
                rightoperand: endDate.toISOString()
            })

            await LicenseAssignmentDAO.updateById(userLicense.policyid, userLicense)
            const redirect_uri = metadata?.technical.location[0]

            return res.redirect(redirect_uri)
        } catch (err: any) {
            return res.status(err?.response?.statusCode || 500).json(err)
        }

    }

}

export default new LicenseAssignmentController().router
