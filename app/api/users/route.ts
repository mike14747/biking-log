import { NextRequest, NextResponse } from 'next/server';
import { getInfoForAllUsers, registerNewUser } from '../../../lib/api';

// get info for all users
export async function GET() {
    const data = await getInfoForAllUsers().catch(error => {
        console.log(error);
        return new Response(null, { status: 500 });
    });
    return data ? NextResponse.json(data) : new Response(null, { status: 500 });
}

// register a new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.username || !body.password || !body.email) return new Response(null, { status: 400 });

        const result = await registerNewUser(body.username, body.password, body.email);
        return result?.code ? new Response(null, { status: result.code }) : new Response(null, { status: 500 });
    } catch (error) {
        console.log(error);
        return new Response(null, { status: 500 });
    }
}
