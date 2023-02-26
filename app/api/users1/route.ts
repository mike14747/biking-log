// this will get all users and their info (but not riding data) if the http method is GET... and only if the user is logged in with the role of admin

// this route is also used for registering a new user... if the http method is POST

import { NextRequest, NextResponse } from 'next/server';
import { registerNewUser } from '../../../lib/api';

export async function GET() {
    return NextResponse.json({ msg: 'this is the root api GET route' });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.username || !body.password || !body.email) return new Response('Bad Request', { status: 400 });

    try {
        const result = await registerNewUser(body.username, body.password, body.email);
        return result?.code ? new Response(null, { status: result.code }) : new Response('Server Error', { status: 500 });
    } catch (error) {
        console.log(error);
        return new Response(null, { status: 500 });
    }
}
