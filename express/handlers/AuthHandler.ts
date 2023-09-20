import axios, { AxiosError } from "axios"
import { Handler } from "express"


export class AuthHandler {


    static requireSessison: Handler = async (req, res, next) => {
        const access_token = req.headers.authorization?.split(' ')[1]
        if (access_token) req.session.access_token = access_token
        
        if (req.session.access_token) {
            try {
                 const keycloack_access_token = req.session.access_token
                const keycloak_sanis_exchange_resp = await axios.get(`${process.env.OIDC_EXCHANGE_TOKEN_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${keycloack_access_token}`
                    }
                })
                const sanis_access_token = keycloak_sanis_exchange_resp.data.access_token
                const sanis_user_resp = await axios.get(`${process.env.OIDC_SANIS_USERINFO_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${sanis_access_token}`
                    }
                })
                req.session.user = sanis_user_resp.data
                return next()
            } catch (err: any) {
                // if response status of err is 401, then try refresh token
                if (err.response?.status === 401 || err.response?.status === 400) {
                    console.log('refresh old access token')
                    try {
                        const refresh_token = req.session.sanis_refresh_token
                        // get new access token from refresh token
                        const sanis_resp = await axios.post(`${process.env.SANIS_TOKEN_ENDPOINT}`, {
                            grant_type: 'refresh_token',
                            client_id: process.env.SANIS_CLIENT_ID,
                            client_secret: process.env.SANIS_CLIENT_SECRET,
                            refresh_token
                        },
                            {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }
                        )

                        const sanis_access_token = sanis_resp.data.access_token
                        const sanis_user_resp = await axios.get(`${process.env.OIDC_SANIS_USERINFO_ENDPOINT}`, {
                            headers: {
                                Authorization: `Bearer ${sanis_access_token}`
                            }
                        })
                        req.session.user = sanis_user_resp.data
                        console.log('refreshed session')
                        return next()
                    } catch (err: any) {
                        console.log(err.response.data)
                        return next(err)
                    }
                }

                return next(err)
            }
        }
        return res.status(403).send('Not session available')
    }

}   