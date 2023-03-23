// this route will get all user info for a single user (but not riding data) by id if the http method is GET

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getUserProfile } from '../../../../lib/api';

type ParamsType = {
    params: {
        id: string;
    }
}

export async function GET(request: NextRequest, { params }: ParamsType) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json({ error: 'You need to be logged in to access this route.' }, { status: 401 });

        const id = params.id;
        if (token.id !== id) return NextResponse.json(null, { status: 400 });

        const data = await getUserProfile(parseInt(id));
        if (!data) return NextResponse.json(null, { status: 500 });
        return data.length === 1 ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 404 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

        console.log('error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
