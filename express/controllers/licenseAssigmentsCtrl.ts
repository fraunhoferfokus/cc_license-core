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
        this.router.get('/users', this.getLicenseAssingmentForUser)
        this.router.get('/', this.getLicenseAssignments);
        this.router.get('/:id', this.getLicenseAssignment);
        this.router.post('/', this.createLicenseAssignment);
        this.router.delete('/:id', this.deleteLicenseAssignment);
    }

    getLicenseAssingmentForUser: express.Handler = async (req, res, next) => {
        try {
            const licenseAssignments = await LicenseAssignmentDAO.findAll()
            const authorization = req.headers.authorization
            if (!authorization) {
                return res.status(401).send('Authorization header not found')
            }
            const access_token = authorization.split(' ')[1]
            // get user id from access token

            const me = (await axios.get(`${process.env.OIDC_USERINFO_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
            )).data

            const userID = me.email
            const userLicenseAssignments = licenseAssignments.filter(licenseAssignment => licenseAssignment.permissions![0]!.assignee === userID)
            return res.json(userLicenseAssignments)
        } catch (err: any) {
            return res.status(err?.response?.statusCode || 500).json(err)
        }

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
            const authorization = req.headers.authorization

            const config = {
                headers: {
                    authorization
                }
            }


            const { licenseDefinitionID, targetID } = req.body

            const licenseDefinition: LicenseDefinitionModel = (await axios.get(`${licenseDefinitionID}`)).data
            const licenseAssignments = await LicenseAssignmentDAO.findAll()

            // check if licenseDefinition is a for group or for user
            const permissions = licenseDefinition.permissions!
            const licenseType = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/purpose')!.rightoperand

            const amount = parseInt(permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/count')!.rightoperand!)
            const role = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/recipient')?.rightoperand
            const assigner = permissions[0].assigner

            const target = permissions[0].target


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
                    target,
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
                case 'Volumenlizenz':
                    const found = licenseAssignments.find((assignment) => assignment.inheritfrom === licenseDefinitionID)
                    const user = (await axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/users/${targetID}`, config)).data
                    if (found) return res.status(400).json({ message: 'Single-License already assigned' })
                    if (role && !user.gruppen.find((gruppe: any) => gruppe.rolle === role)) {
                        return res.status(400).json({ message: 'User has no role to use this license' })
                    }
                    await LicenseAssignmentDAO.create(toBeCreated)
                    break;
                case 'Gruppenlizenz':
                    const promiseArr: any[] = []
                    const alreadyHave = licenseAssignments.find((assignment) =>
                        assignment.inheritfrom === licenseDefinitionID &&
                        assignment.permissions![0].assignee === targetID
                    )

                    if (alreadyHave) {
                        return res.status(400).json({ message: 'That group is already enrolled to that license-defintion' })

                    }

                    const count = licenseAssignments.filter((assignment) =>
                        assignment.inheritfrom === licenseDefinitionID
                        && assignment.permissions![0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/recipient')).length

                    if (count >= 1) {
                        return res.status(400).json({ message: 'Group licenses can only be enrolled once!' })
                    }

                    // create for every user 
                    const group: any = (await axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/groups/${targetID}`, config)).data
                    for (const user of group.users) {

                        // check whether already assignment for that user exist and skip
                        const curr: any = user
                        const found = licenseAssignments.find((assignment) => assignment.inheritfrom === licenseDefinitionID &&
                            assignment.permissions![0].assignee === curr.id
                        )

                        if (!found) {
                            const unique = uuid()
                            const userAssingment: LicenseDefinitionModel = JSON.parse(JSON.stringify({ ...toBeCreated, _id: unique, policyid: unique })) as LicenseDefinitionModel
                            userAssingment.permissions![0].assignee = curr.id
                            promiseArr.push(LicenseAssignmentDAO.create(userAssingment))
                        }
                    }


                    toBeCreated.permissions![0].constraints?.push({
                        "name": "http://www.w3.org/ns/odrl/2/recipient",
                        "operator": "eq",
                        "rightoperand": "group"
                    })

                    console.log(toBeCreated.permissions![0].assignee)
                    promiseArr.push(LicenseAssignmentDAO.create(toBeCreated))
                    await Promise.all(promiseArr)
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
            const authorization = req.headers.authorization
            const config = {
                headers: {
                    authorization
                }
            }

            const licenseAssignments = await LicenseAssignmentDAO.findAll()
            const licenseAssignment = await LicenseAssignmentDAO.findById(req.params.id)
            const licenseDefinition: LicenseDefinitionModel = (await axios.get(`${licenseAssignment.inheritfrom}`)).data
            const permissions = licenseDefinition.permissions!
            const licenseType = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/purpose')!.rightoperand
            const amount = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/count')!.rightoperand
            const role = permissions[0].constraints?.find((constraint) => constraint.name === 'http://www.w3.org/ns/odrl/2/recipient')?.rightoperand
            const assigner = permissions[0].assigner

            switch (licenseType) {
                case 'Einzellizenz':
                case 'Volumenlizenz':
                    if (!licenseAssignment!.permissions![0].constraints!.find((constraint) => constraint.rightoperand === 'deactivated')) {
                        return res.status(400).json({ message: 'Lizenz wurde bereits aktiviert und kann nicht rückgängig gemacht werden' })
                    }
                    await LicenseAssignmentDAO.deleteById(req.params.id)
                    break;
                case 'Gruppenlizenz':
                    // create for every user 
                    const promiseArr: any[] = []
                    const group: any = (await axios.get(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/user_manager/groups/${licenseAssignment.permissions![0].assignee}`, config)).data
                    for (const user of group.users) {
                        const userLicenseAssignment = licenseAssignments.find((item) =>
                            item.permissions![0].assignee === user.id
                        )!

                        // check whether one has already been activated!
                        // if (!userLicenseAssignment?.permissions![0].constraints?.find((item) => item.name === 'http://www.w3.org/ns/odrl/2/event' && item.rightoperand === 'deactivated')) {
                        //     return res.status(400).json({ message: 'Die Rückweisung funktioniert nicht, da einer der User schon die Gruppenlizenz aktiviert hat..' })

                        // }
                        promiseArr.push(LicenseAssignmentDAO.deleteById(userLicenseAssignment._id))
                    }
                    promiseArr.push(LicenseAssignmentDAO.deleteById(licenseAssignment._id))

                    await Promise.all(promiseArr)
                    break;
            }

            return res.status(204).send()

        } catch (err: any) {
            console.log(err)
            return res.status(err?.response?.statusCode || 500).json(err)
        }
    }
}

export default new LicenseAssignmentController().router
