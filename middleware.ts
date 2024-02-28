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