// server.js
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import axios from 'axios'
import express from 'express'
import session from 'express-session'
import next from 'next'
import launchCtrl from './express/controllers/launchCtrl'
import licenseAssigmentsCtrl from './express/controllers/licenseAssigmentsCtrl'
import { AuthHandler } from './express/handlers/AuthHandler'




const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '4001')
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const client_secret = process.env.OIDC_CLIENT_SECRET!
const client_id = process.env.OIDC_CLIENT_ID!
const token_endpoint = process.env.OIDC_TOKEN_ENDPOINT!
const deployURL = process.env.DEPLOY_URL!

declare module 'express-session' {
    export interface SessionData {
        access_token: string,
        user?: {
            sub: string,
            name: string,
            preferred_username: string,
            given_name: string,
            family_name: string,
            email: string
        }
    }
}

app.prepare().then(() => {
    const server = express()

    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))

    server.use(session({
        secret: 'keyboard cat',
    }))

    server.get('/user-info', AuthHandler.requireSessison, (req, res) => {
        return res.send(req.session.user)
    })

    server.get('/oidc-auth/:code', async (req, res, next) => {
        // get access token from code
        const code = req.params.code
        const url = token_endpoint
        try {

            const resp = await axios(url, {
                method: 'POST',
                data: {
                    grant_type: 'authorization_code',
                    client_id,
                    client_secret,
                    code,
                    redirect_uri: `${process.env.DEPLOY_URL}/signIn`
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            const access_token = resp.data.access_token
            req.session.access_token = access_token
            return res.send()
        } catch (err: any) {
            return res.status(err.response.statusCode).send(err.response.data)
        }

    })

    server.use('/license-assignments', licenseAssigmentsCtrl)

    server.use('/launch',
        launchCtrl
    )



    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
    })

}).catch((err) =>{
    console.log(err)
})