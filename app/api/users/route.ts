import { NextRequest, NextResponse } from 'next/server';
import { getInfoForAllUsers, registerNewUser } from '../../../lib/api';

// get info for all users
export async function GET() {
    try {
        // check for a session here and make sure the user is logged in and has a role of admin
        // ...once next-auth supports in it the appDir
        const data = await getInfoForAllUsers();
        return data ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// register a new user
export async function POST(request: NextRequest) {
    try {
        const { username, password, email } = await request.json();
        if (username || password || email) return NextResponse.json(null, { status: 400 });

        const result = await registerNewUser(username, password, email);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
