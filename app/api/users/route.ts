import { NextRequest, NextResponse } from 'next/server';
import { getInfoForAllUsers, registerNewUser } from '../../../lib/api';
import { getToken } from 'next-auth/jwt';

// get info for all users, but only if the user is logged in and has a role of admin
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });
        if (token?.role !== 'admin') return NextResponse.json({ error: 'You need to be logged in with the role of admin to access this route.' }, { status: 401 });

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
        if (!username || !password || !email) return NextResponse.json(null, { status: 400 });

        const result = await registerNewUser(username, password, email);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
