import { keyframes, unstable_useId } from "@mui/material";
import axios from "axios";
import express from "express";
import { LicenseDefinitionModel, Policy } from "license_manager";
import next from "next";
import LicenseAssignmentDAO from "../models/LicenseAssignmentDAO";
import { v4 as uuid } from 'uuid'
import { userAgent } from "next/server";
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2";

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

            console.log({
                requestingUser
            })

            const [sanisUserPromise, licenseAssignments] = await Promise.all([(
                axios.get(`${process.env.GATEWAY_URL}/user_manager/users/${requestingUser?.pid}`, {
                    headers: {
                        Authorization: `Bearer ${req.session.access_token}`
                    }
                })),
            LicenseAssignmentDAO.findAll()
            ])

            const user = sanisUserPromise.data
            const userID = user.id
            let userLicenseAssignments = licenseAssignments.filter(licenseAssignment => licenseAssignment.assignee === userID)



            if (schema === 'urn:bilo:assignment') {
                const { orgs, groups, email } = user
                const [first_name, last_name] = email.split(' ')
                let context: { [key: string]: any } = {}


                for (const group of groups) {

                    const org_map = orgs.find((org:any) => Object.keys(org).some((key) => key === group.orgid))
                    const org = org_map[group.orgid]

                    let groupLicenses = licenseAssignments.filter(licenseAssignment => licenseAssignment.assignee === group.id)
                    .map((assignment) =>( assignment.inheritFrom as string)?.split('/').pop())

                    if (context[group.orgid] === undefined) {
                        context[group.orgid] = {
                            school_name:org.school_name,
                            classes: [],
                            workgroups: [],
                            roles: org.roles,
                            licenses: []
                        }
                    }else{
                        if(group.type ==='Klasse') {
                            context[group.orgid]['classes'].push({
                                name: group.name,
                                id: group.id,
                                licenses: groupLicenses
                            })
                        }
                    }
                }


                // for (const group of groups) {
                //     if (context[group.orgid] === undefined) context[group.orgid] = { roles: new Set() }
                //     context[group.orgid]['roles'] = new Set([...context[group.orgid]['roles'], group.role])
                // }

                // userLicenseAssignments = userLicenseAssignments.filter((assignment) => {
                //     assignment.

                // })

                let licenses = userLicenseAssignments.map((assignment) => (assignment.inheritFrom as string).split('/').pop())


                return res.json({
                    id: userID,
                    first_name,
                    last_name,
                    context,
                    licenses,
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
            const sessionCookie = req.headers.cookie;

            const config = {
                headers: {
                    'Cookie': sessionCookie
                    // authorization: `Bearer ${req.session.access_token}`
                }
            }

            const { licenseDefinitionID, targetID } = req.body
            const licenseDefinition: Policy = (await axios.get(`${licenseDefinitionID}`)).data
            const licenseAssignments = await LicenseAssignmentDAO.findAll()
            const constraints = (licenseDefinition.action![0] as ActionObject).refinement as Constraint[]
            const licenseType = constraints.find((constraint) => constraint.uid === 'lizenztyp')!.rightOperand

            const amount = parseInt(constraints.find((constraint) => constraint.uid === 'lizenzanzahl')!.rightOperand)
            const role = constraints?.find((constraint) => constraint.uid === 'sonderlizenz')?.rightOperand
            const assigner = licenseDefinition.assigner
            const target = licenseDefinition.target


            const unique_id = uuid()
            const toBeCreated = new Policy({
                "@type": "Ticket",
                _id: unique_id,
                uid: unique_id,
                inheritFrom: licenseDefinitionID,
                assigner,
                assignee: targetID,
                target,
                action: [{
                    action: "use",
                    refinement: [
                        {
                            uid: "aktivierungsstatus",
                            rightOperand: "false",
                            operator: "eq",
                            leftOperand: "event"
                        }
                    ]
                }],

            })



            switch (licenseType) {
                case 'Einzellizenz':
                case 'Volumenlizenz':
                    console.log('here we are')
                    const found = licenseAssignments.find((assignment) => assignment.inheritFrom === licenseDefinitionID)

                    console.log(process.env.GATEWAY_URL)

                    const user = (await axios.get(`${process.env.GATEWAY_URL}/user_manager/users/${targetID}`, config)).data
                    console.log({ user })



                    if (found) return res.status(400).json({ message: 'Single-License already assigned' })
                    if (role && !user.gruppen.find((gruppe: any) => gruppe.rolle === role)) {
                        return res.status(400).json({ message: 'User has no role to use this license' })
                    }
                    await LicenseAssignmentDAO.create(toBeCreated)
                    break;
                case 'Gruppenlizenz':
                    const promiseArr: any[] = []
                    const group: any = (await axios.get(`${process.env.GATEWAY_URL}/user_manager/groups/${targetID}`, config)).data

                    const alreadyHave = licenseAssignments.find((assignment) =>
                        assignment.inheritFrom === licenseDefinitionID
                        &&
                        assignment.assignee === targetID
                    )

                    if (alreadyHave) {
                        return res.status(400).json({ message: 'That group is already enrolled to that license-defintion' })
                    }

                    // create for every user 
                    for (const userId of group.users) {
                        const found = licenseAssignments.find((assignment) =>
                            assignment['dc:isPartOf'] === group.id
                            &&
                            assignment.inheritFrom === licenseDefinitionID
                        )

                        if (!found) {
                            const unique = uuid()
                            const userAssingment: Policy = new Policy({
                                ...toBeCreated,
                                assignee: userId,
                                _id: unique,
                                uid: unique,
                                "dc:isPartOf": group.id,
                            })
                            promiseArr.push(LicenseAssignmentDAO.create(userAssingment))
                        }
                    }

                    ((toBeCreated.action![0] as ActionObject).refinement as Constraint[]).push({
                        uid: "lizenzart",
                        leftOperand: "recipient",
                        "operator": "eq",
                        rightOperand: "group"
                    })

                    promiseArr.push(LicenseAssignmentDAO.create(toBeCreated))
                    await Promise.all(promiseArr)
                    break;
            }


            return res.status(204).send()
        } catch (err: any) {
            console.log(err.response.data)
            return res.status(err?.response?.statusCode || 500).json(err)
        }
    }

    deleteLicenseAssignment: express.Handler = async (req, res, next) => {
        try {
            console.log(req.params.id)
            const licenseAssignments = await LicenseAssignmentDAO.findAll()
            const licenseAssignment = await LicenseAssignmentDAO.findById(req.params.id)
            const licenseDefinition: Policy = (await axios.get(`${licenseAssignment.inheritFrom}`)).data
            // const permissions = licenseDefinition.permissions!

            let definitionConstraints = (licenseDefinition.action![0] as ActionObject).refinement as Constraint[]
            const licenseType = definitionConstraints!.find((constraint) =>
                constraint.uid === 'lizenztyp'
            )!.rightOperand

            let assignmentConstraints = (licenseAssignment.action![0] as ActionObject).refinement as Constraint[]


            let licenseActivated = assignmentConstraints.find((constraint) => constraint.uid === 'aktivierungsstatus')!.rightOperand === 'true'
            if (licenseActivated) {
                return res.status(400).json({ message: 'Lizenz wurde bereits aktiviert und kann nicht rückgängig gemacht werden' })
            }


            switch (licenseType) {
                case 'Einzellizenz':
                case 'Volumenlizenz':
                    await LicenseAssignmentDAO.deleteById(req.params.id)
                    break;
                case 'Gruppenlizenz':
                    // create for every user 
                    const promiseArr: any[] = []
                    const userLicenses = licenseAssignments.filter((assignment) => assignment['dc:isPartOf'] === licenseAssignment.assignee)
                    for (const userLicense of userLicenses) {
                        promiseArr.push(LicenseAssignmentDAO.deleteById(userLicense._id))
                    }
                    await Promise.all([...promiseArr, LicenseAssignmentDAO.deleteById(req.params.id)])
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
