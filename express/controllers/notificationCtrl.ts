/* -----------------------------------------------------------------------------
 *  Copyright (c) 2023, Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.   
 *
 *  No Patent Rights, Trademark Rights and/or other Intellectual Property 
 *  Rights other than the rights under this license are granted. 
 *  All other rights reserved.
 *
 *  For any other rights, a separate agreement needs to be closed.
 * 
 *  For more information please contact:   
 *  Fraunhofer FOKUS
 *  Kaiserin-Augusta-Allee 31
 *  10589 Berlin, Germany 
 *  https://www.fokus.fraunhofer.de/go/fame
 *  famecontact@fokus.fraunhofer.de
 * -----------------------------------------------------------------------------
 */
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
