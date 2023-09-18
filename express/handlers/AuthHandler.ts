import axios, { AxiosError } from "axios"
import { Handler } from "express"


export class AuthHandler {


    static requireSessison: Handler = async (req, res, next) => {
        const access_token = req.headers.authorization?.split(' ')[1]
        if (access_token) req.session.access_token = access_token
        if (req.session.access_token) {
            try {
                const resp = await axios.get(`${process.env.OIDC_SANIS_USERINFO_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${req.session.access_token}`
                    }
                })
                req.session.user = resp.data
                return next()
            } catch (err: any) {
                // if response status of err is 401, then try refresh token
                if (err.response.status === 401) {
                    console.log('refresh old access token')
                    try {
                        const refresh_token = req.session.refresh_token
                        // get new access token from refresh token
                        const resp2 = await axios.post(`${process.env.OIDC_TOKEN_ENDPOINT}`, {
                            grant_type: 'refresh_token',
                            client_id: process.env.OIDC_CLIENT_ID,
                            client_secret: process.env.OIDC_CLIENT_SECRET,
                            refresh_token
                        },
                            {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }

                        )
                        const new_access_token = resp2.data.access_token
                        req.session.access_token = new_access_token
                        return next()
                    } catch (err: any) {
                        console.log(err)
                        return next(err)
                    }
                }

                return next(err)
            }
        }
        return res.status(403).send('Not session available')
    }

}   