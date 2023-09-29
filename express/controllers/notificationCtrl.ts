import axios from "axios";
import express from "express";
import { LicenseDefinitionModel } from "license_manager";
import { v4 as uuid } from 'uuid';
import NotificationDAO from "../models/NotificationDAO";



export type Notification = {
    product_id: string | null,
    license_type: string | null,
    start_date: Date | null,
    end_date: Date | null,
    elapsed_time: number | null,
    count: number | null
}

class NotificationCtrl {

    router: express.Router;

    constructor() {
        this.router = express.Router()
        this.configRouters()
    }

    configRouters() {
        this.router.get('/', this.getNotifications)
        this.router.post('/', this.createNotification)
        this.router.delete('/:id', this.deleteNotification)
    }

    getNotifications: express.Handler = async (req, res) => {
        try {
            const notifications = await NotificationDAO.findAll()
            return res.send(notifications)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    createNotification: express.Handler = async (req, res) => {
        const notifcation: Notification = req.body
        const id = uuid()
        // const notificationModel = new LicenseDefinitionModel({
        //     _id: id,
        //     policyid: id,
        //     policytype: 'http://www.w3.org/ns/odrl/2/Request',
        //     permissions: [
        //         {
        //             target: notifcation.product_id!,
        //             action: 'http://www.w3.org/ns/odrl/2/use',
        //             constraints: [
        //                 {
        //                     name: 'http://www.w3.org/ns/odrl/2/dateTime',
        //                     operator: 'http://www.w3.org/ns/odrl/2/gteq',
        //                     rightoperand: notifcation.start_date?.toString()!
        //                 },
        //                 {
        //                     name: 'http://www.w3.org/ns/odrl/2/dateTime',
        //                     operator: 'http://www.w3.org/ns/odrl/2/lteq',
        //                     rightoperand: notifcation.end_date?.toString()!
        //                 },
        //                 {
        //                     name: 'http://www.w3.org/ns/odrl/2/elapsedTime',
        //                     operator: 'http://www.w3.org/ns/odrl/2/eq',
        //                     rightoperand: notifcation.elapsed_time!.toString()
        //                 },
        //                 {
        //                     name: 'http://www.w3.org/ns/odrl/2/count',
        //                     operator: 'http://www.w3.org/ns/odrl/2/eq',
        //                     rightoperand: notifcation.count!.toString()
        //                 },
        //                 {
        //                     name: 'http://www.w3.org/ns/odrl/2/purpose',
        //                     operator: 'http://www.w3.org/ns/odrl/2/eq',
        //                     rightoperand: notifcation.license_type!
        //                 }
        //             ]
        //         }
        //     ]

        // })
        // await NotificationDAO.insert(notificationModel)
        return res.send()
    }

    deleteNotification: express.Handler = async (req, res) => {
        try {
            const { id } = req.params
            await NotificationDAO.deleteById(id)
            return res.send()
        } catch (err) {
            return res.status(500).send(err)
        }
    }


}

export default new NotificationCtrl().router
