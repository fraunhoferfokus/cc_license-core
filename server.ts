import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
process.env.MARIA_CONFIG = process.env.MARIA_CONFIG!.replace('tcp://', '')
import axios from 'axios'
import RedisStore from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import next from 'next'
import { createClient } from "redis"
import swaggerJSDoc from 'swagger-jsdoc'
import launchCtrl from './express/controllers/launchCtrl'
import licenseAssigmentsCtrl from './express/controllers/licenseAssigmentsCtrl'
import notificationCtrl from './express/controllers/notificationCtrl'
import { AuthHandler } from './express/handlers/AuthHandler'
import { scheduleEveryDay } from './helper/scheduler'


// use RedisStore for express-session
let redis_url = process.env.REDIS_URL!.replace('tcp://', '')
console.log({ url: redis_url })

let redisClient = createClient(
    {
        url: redis_url
    }
)

redisClient.connect().then(() => {
    console.log('redis connected')
})
    .catch((err) => {
        console.log(err)
    })

// @ts-ignore
let redisStore = new RedisStore({
    // @ts-ignore
    client: redisClient,
    prefix: "myapp:",
})

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

export interface SANIS_USER {
    pid: string,
    personenkontexte: {
        ktid: string,
        organisation: {
            id: string,
            name: string
            typ: string
        }
        rolle: string
    }[]
}

declare module 'express-session' {
    export interface SessionData {
        access_token: string,
        refresh_token: string,
        id_token: string,
        user?: SANIS_USER
    }
}

if (process.env.DELETE_USE_CASE_EVERY_DAY) scheduleEveryDay()


app.prepare().then(() => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Auth-Manager',
                version: '1.0.0',
            },
        },
        apis: ['./server.ts', './express/controllers/*'], // files containing annotations as above
    };

    const openApiSpecification = swaggerJSDoc(options)
    const server = express()

    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))

    server.use(cors())

    server.get('/api-docs', (req, res, next) => {
        return res.json(openApiSpecification)
    })

    server.use(
        session({
            store: redisStore,
            resave: false, // required: force lightweight session keep alive (touch)
            saveUninitialized: false, // recommended: only save session when data exists
            secret: "keyboard cat",
        })
    )

    server.get('/api/user-info', AuthHandler.requireSessison, (req, res) => {
        return res.send(req.session.user)
    })

    server.get('/api/oidc-auth/:code', async (req, res, next) => {
        // get access token from code
        const code = req.params.code
        const url = token_endpoint
        try {
            const keycloak_response = await axios(url, {
                method: 'POST',
                data: {
                    grant_type: 'authorization_code',
                    client_id,
                    client_secret,
                    code,
                    redirect_uri: `${process.env.OIDC_REDIRECT_URI}`
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            const keycloak_access_token = keycloak_response.data.access_token
            const keycloak_exchange_sanis_response = await axios.get(`${process.env.OIDC_EXCHANGE_TOKEN_ENDPOINT}`, {
                headers: {
                    'Authorization': `Bearer ${keycloak_access_token}`
                }
            });
            const data = keycloak_exchange_sanis_response.data
            // berarer auth
            const user_with_context_resp = await axios.get(`${process.env.OIDC_SANIS_USERINFO_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${data.access_token}`
                }
            })




            const user = user_with_context_resp.data
            const rolle = user.personenkontexte[0]?.rolle
            const id_token = keycloak_response.data.id_token
            const self_url = process.env.NEXT_PUBLIC_SELF_URL?.replace('/api', '')

            if (rolle !== 'Leit') {
                const id_token_hint = id_token
                const post_logout_redirect_uri = `${self_url}/forbidden`
                const logout_url = `${process.env.OIDC_LOGOUT_URL}?response_type=code&scope=openid&client_id=${process.env.OIDC_CLIENT_ID}&id_token_hint=${id_token_hint}&post_logout_redirect_uri=${post_logout_redirect_uri}`
                return res.redirect(logout_url)
            } else {
                req.session.user = user_with_context_resp.data
                req.session.access_token = keycloak_access_token
                req.session.refresh_token = keycloak_response.data.refresh_token
                req.session.id_token = keycloak_response.data.id_token
            }
            return res.redirect(`${self_url}`)
        } catch (err: any) {
            console.log('no valid user session')
            return res.status(err.response.statusCode || 500).send(err.response.data)
        }
    })

    // server.get('/access_token', AuthHandler.requireSessison, (req, res) => {
    //     return res.send(req.session.access_token)
    // })

    server.get('/api/logout', AuthHandler.requireSessison, async (req, res) => {
        try {
            const id_token_hint = req.session.id_token
            const post_logout_redirect_uri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI
            const url = `${process.env.OIDC_LOGOUT_URL}?response_type=code&scope=openid&client_id=${process.env.OIDC_CLIENT_ID}&id_token_hint=${id_token_hint}&post_logout_redirect_uri=${post_logout_redirect_uri}`
            req.session.destroy((err) => {
                if(err) return next(err)

                res.redirect(url)
            })
        } catch (err: any) {
            return next(err)
        }
    })

    server.use('/api/license-assignments', AuthHandler.requireSessison, licenseAssigmentsCtrl)

    server.use('/api/launch',
        launchCtrl
    )

    server.use('/api/notifications',
        notificationCtrl
    )

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
    })

}).catch((err) => {
    console.log(`error while starting server`)
    console.log({ err })
})