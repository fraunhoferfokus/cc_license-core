import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { Button } from "@mui/material"

export default function SignIn() {
    const router = useRouter()
    const { code } = router.query

    useEffect(() => {
        if (code) {
            window.location.href = `${process.env.NEXT_PUBLIC_SELF_URL}/oidc-auth/${code}`
            // axios.get(`/api/oidc-auth/${code}`, {
            //     withCredentials: true
            // }).then((resp) => {
            //     router.push("/")
            // }).catch((err) => {
            //     router.push("/signIn")
            // })
        }

    }, [code])

    const auth_url = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}?response_type=code&scope=openid&client_id=${process.env.NEXT_PUBLIC_OIDC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI}`;

    return <>
        <div className="bg-[#e7ebef] flex items-center justify-center h-[100%] flex-col">
            <div
                className="flex-1 flex justify-centers items-center"
            >
            <Button variant="contained" href={auth_url}
                

                >Sign In with {process.env.BROKER_NAME || 'moin.schule'}</Button>
                
            </div>
            <div
                className="mb-[20px]"
            >
                <a
                    href={process.env.NEXT_PUBLIC_DATENSCHUTZ_URL}
                    className="text-[#2d7592] text-underline"
                >
                    Datenschutz
                </a>
                &nbsp;
                |
                &nbsp;
                <a
                    href={process.env.NEXT_PUBLIC_IMPRESSUM_URL}
                    className="text-[#2d7592] text-underline"
                >
                    Impressum
                </a>

            </div>

        </div>
    </>


}