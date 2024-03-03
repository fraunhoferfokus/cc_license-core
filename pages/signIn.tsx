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
        } else {
            window.location.href = `${process.env.NEXT_PUBLIC_KEYCLOAK_AUTH_ENDPOINT}?response_type=code&scope=openid&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`
        }

    }, [code])

    const auth_url = `${process.env.NEXT_PUBLIC_KEYCLOAK_AUTH_ENDPOINT}?response_type=code&scope=openid&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

    return <>
        <div className="bg-[#e7ebef] flex items-center justify-center h-[100%] flex-col">
            <div
                className="flex-1 flex justify-centers items-center"
            >
                {/* <Button variant="contained" href={auth_url}


                >Sign In with {process.env.BROKER_NAME || 'moin.schule'}</Button> */}

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