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
import axios from 'axios'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import cookie from 'cookie';


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    try {
        const allCookiesString = (request.cookies.getAll()).map((cookie) => {
            return `${cookie.name}=${cookie.value}`
        })[0]

        const url = process.env.DEPLOY_URL
        const response = await fetch(`${url}/user-info`, {
            headers: {
                Cookie: allCookiesString
            }
        });

        if (response.ok) {
            return NextResponse.next()
        } else {
            throw new Error('no session available')
        }
        // get nextjs 
    } catch (err) {
        return NextResponse.redirect(new URL('/signIn', request.url))
    }
    // return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/dashboard/:path', '/medien/:path*', '/lizenzen/:path*', '/lizenz-zuweisen/:path*'],

}