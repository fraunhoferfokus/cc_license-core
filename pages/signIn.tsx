import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { Button } from "@mui/material"

export default function SignIn() {
    const router = useRouter()
    const { code } = router.query

    useEffect(() => {
        if (code) {
            axios.get(`oidc-auth/${code}`, {
                withCredentials: true
            }).then((resp) => {
                router.push("/")
            }).catch((err) => {
                router.push("/signIn")
            })
        }

    }, [code])


    return <>
        <div className="bg-[#e7ebef] flex items-center justify-center h-[100%]">
            <Button variant="contained" href={`
            http://localhost:8080/realms/test/protocol/openid-connect/auth?response_type=code&scope=openid profile email&client_id=license_component&redirect_uri=http://localhost:4001/signIn
            `}>Sign In with Keycloak</Button>
        </div>
    </>


}