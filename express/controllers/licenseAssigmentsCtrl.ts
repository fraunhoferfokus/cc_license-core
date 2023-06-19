import { unstable_useId } from "@mui/material";
import axios from "axios";
import express from "express";
import { LicenseDefinitionModel } from "license_manager";
import next from "next";
import LicenseAssignmentDAO from "../models/LicenseAssignmentDAO";
import { v4 as uuid } from 'uuid'
import { userAgent } from "next/server";

/**
 * @openapi
 * components:
 *   schemas:
 *     Constraint:
 *       type: object
 *       required:
 *         - name
 *         - operator
 *         - rightoperand
 *       properties:
 *         name:
 *           type: string
 *         operator:
 *           type: string
 *         rightoperand:
 *           type: string
 *         rightoperanddatatype:
 *           type: string
 *         rightoperandunit:
 *           type: string
 *         status:
 *           type: string
 *       xml:
 *         name: Constraint
 *       additionalProperties: false
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Prohibdutytype:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         assigner:
 *           type: string
 *         assignee:
 *           type: string
 *         assignee_scope:
 *           type: string
 *         target:
 *           type: string
 *         output:
 *           type: string
 *         action:
 *           type: string
 *         constraints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Constraint'
 *       xml:
 *         name: Prohibdutytype
 *       additionalProperties: false
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         assigner:
 *           type: string
 *         assigner_scope:
 *           type: string
 *         assignee:
 *           type: string
 *         target:
 *           type: string
 *         output:
 *           type: string
 *         action:
 *           type: string
 *         constraints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Constraint'
 *         duties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Prohibdutytype'
 *       xml:
 *         name: Permission
 *       additionalProperties: false
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     LicenseDefinition:
 *       type: object
 *       required:
 *         - policyid
 *         - policytype
 *         - policyid
 *         - policyid
 *       properties:
 *         _is:
 *           type: string
 *         policyid:
 *           type: string
 *         policytype:
 *           type: string
 *         conflict:
 *           type: string
 *           enum:
 *             - 'perm'
 *             - 'prohibit'
 *             - 'invalid'
 *         undefined:
 *           type: string
 *           enum:
 *             - 'invalid'
 *             - 'support'
 *             - 'ignore'
 *         inheritallowed:
 *           type: boolean
 *         inheritfrom:
 *           type: string
 *         inheritrelation:
 *           type: string
 *         policyprofile:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *         prohibitions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Prohibdutytype'
 *       xml:
 *         name: LicenseDefinition
 *       additionalProperties: false
 */

/**
 * @openapi
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */


class LicenseAssignmentController {

    router: express.Router;

    constructor() {
        this.router = express.Router()
        this.configRouters()
    }

    configRouters() {

        /**
         * @openapi
         * 
         * /license-assignments/users:
         *      
         *      get:
         *          tags: 
         *              - core
         *          description: Get the license-assignments of a user
         *          responses:
         *              200: 
         *                  description: Returns an array of ODRL license-assignments
         *                  content:
         *                      application/json:
         *                          schema:
         *                              type: array
         *                              items:
         *                                  $ref: '#/components/schemas/LicenseDefinition'
         *          security: 
         *              - bearerAuth: [] 
         *  
         */
        this.router.get('/users', this.getLicenseAssingmentForUser)
        this.router.get('/', this.getLicenseAssignments);
        this.router.get('/:id', this.getLicenseAssignment);
        this.router.post('/', this.createLicenseAssignment);
        this.router.delete('/:id', this.deleteLicenseAssignment);

    }

    getLicenseAssingmentForUser: express.Handler = async (req, res, next) => {
        try {
            const schema = req.query.schema

            const requestingUser = req.session.user
            console.log({ requestingUser })
            const [sanisUserPromise, licenseAssignments] = await Promise.all([(
                axios.get(`${process.env.GATEWAY_URL}/user_manager/users/${requestingUser?.preferred_username}`, {
                    headers: {
                        Authorization: `Bearer ${req.session.access_token}`
                    }
                })),
            LicenseAssignmentDAO.findAll()
            ])

            const sanisUser = sanisUserPromise.data

            const userID = sanisUser.id
            let userLicenseAssignments = licenseAssignments.filter(licenseAssignment => licenseAssignment.permissions![0]!.assignee === userID)

            if (schema === 'urn:bilo:assignment') {
                const { orgs, groups, email } = sanisUser
                const [first_name, last_name] = email.split(' ')
                let context: { [key: string]: any } = orgs
                
                for (const group of groups) {
                    context[group.orgid]['roles'] = new Set([...context[group.orgid]['roles'], group.role])
                }

                let licenses = userLicenseAssignments.map((assignment) => assignment.inheritfrom?.split('/').pop())


                return res.json({
                    id: userID,
                    first_name,
                    last_name,
                    context,
                    licenses
                })




            }


            return res.json(userLicenseAssignments)
        } catch (err: any) {
            console.log(err)
            return res.status(err?.response?.statusCode || 500).json(err)
        }

    }


    getLicenseAssignments: express.Handler = async (req, res, next) => {
        try {
            let licenseAssignments = await LicenseAssignmentDAO.findAll()
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
            // const authorization = req.headers.authorization

            const config = {
                headers: {
                    authorization: `Bearer ${req.session.access_token}`
                }
            }

            const { licenseDefinitionID, targetID } = req.body
            const licenseDefinition: LicenseDefinitionModel = (await axios.get(`${licenseDefinitionID}`)).data
            const licenseAssignments = await LicenseAssignmentDAO.findAll()
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
                    const user = (await axios.get(`${process.env.GATEWAY_URL}/user_manager/users/${targetID}`, config)).data
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
                    const group: any = (await axios.get(`${process.env.GATEWAY_URL}/user_manager/groups/${targetID}`, config)).data
                    for (const user of group.users) {

                        // check whether already assignment for that user exist and skip
                        const curr: any = user
                        const found = licenseAssignments.find((assignment) => assignment.inheritfrom === licenseDefinitionID &&
                            assignment.permissions![0].assignee === curr.id
                        )

                        if (!found) {
                            const unique = uuid()
                            const userAssingment: LicenseDefinitionModel = JSON.parse(JSON.stringify({ ...toBeCreated, _id: unique, policyid: unique })) as LicenseDefinitionModel
                            userAssingment.permissions![0].assignee = curr
                            promiseArr.push(LicenseAssignmentDAO.create(userAssingment))
                        }
                    }


                    toBeCreated.permissions![0].constraints?.push({
                        "name": "http://www.w3.org/ns/odrl/2/recipient",
                        "operator": "eq",
                        "rightoperand": "group"
                    })

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
            const config = {
                headers: {
                    authorization: `Bearer ${req.session.access_token}`
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
                    const group: any = (await axios.get(`${process.env.GATEWAY_URL}/user_manager/groups/${licenseAssignment.permissions![0].assignee}`, config)).data
                    for (const userId of group.users) {
                        const userLicenseAssignment = licenseAssignments.find((item) =>
                            item.permissions![0].assignee === userId
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
