import axios, { AxiosError } from "axios"
import { Handler } from "express"


export class AuthHandler {


    static requireSessison: Handler = async (req, res, next) => {
        if (req.session.access_token) {
            try {
                const resp = await axios.get('http://localhost:8080/realms/test/protocol/openid-connect/userinfo', {
                    headers: {
                        Authorization: `Bearer ${req.session.access_token}`
                    }
                })
                req.session.user = resp.data
                return next()
            } catch (err: any) {
                if (err instanceof AxiosError) {
                    return res.status(err?.status || 500    ).send(err.response?.data)
                }
                return res.status(500).send(err)
            }
        }
        return res.status(403).send('Not session available')
    }

}   