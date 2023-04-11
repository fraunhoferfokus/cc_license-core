import axios, { AxiosError } from "axios"
import { Handler } from "express"


export class AuthHandler {


    static requireSessison: Handler = async (req, res, next) => {
        const access_token = req.headers.authorization?.split(' ')[1]
        if (access_token) req.session.access_token = access_token

        if (req.session.access_token) {
            try {
                const resp = await axios.get(`${process.env.OIDC_USERINFO_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${req.session.access_token}`
                    }
                })
                req.session.user = resp.data
                return next()
            } catch (err: any) {
                return next(err)
            }
        }
        return res.status(403).send('Not session available')
    }

}   