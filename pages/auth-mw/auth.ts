import axios from "axios"
import { RequestContext } from "next/dist/server/base-server"


export async function requireSession(context: RequestContext) {
    try {
        console.log(process.env.DEPLOY_URL)
        const { req } = context
        const resp = await axios({
            url: `${process.env.DEPLOY_URL}/user-info`,
            headers: req.headers,
        })

        return {
            props: {
                user: resp.data,
            }
        }

    } catch (err) {
        return {
            redirect: {
                destination: '/signIn',
                permanent: false,
            },
        }
    }       
}