// this will get all users and their info (but not riding data) if the http method is GET... and only if the user is logged in with the role of admin

// this route is also used for registering a new user... if the http method is POST

import { NextRequest, NextResponse } from 'next/server';
// import { registerNewUser } from '../../../lib/api';

export async function GET() {
    return NextResponse.json({ msg: 'this is the root api GET route' });
}

export async function POST(request: NextRequest) {
    console.log({ request });
    // if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).end();

    // try {
    //     const response = await registerNewUser(req.body.username, req.body.password, req.body.email);
    //     return response?.code ? res.status(response.code).end() : res.status(500).end();
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).end();
    // }
    // const res = await fetch('https://data.mongodb-api.com/...');
    // const data = await res.json();

    // return Response.json({ data });

    return NextResponse.json({ msg: 'this is the register POST route' });
}
