// this route will get all user info for a single user (but NOT riding data) by id if the http method is GET

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getUserProfile } from '../../../../lib/api';
import { IdParams } from '../../../../types';
import { handleAPICatchError } from '../../../../lib/handleCatchErrors';

export async function GET(request: NextRequest, { params }: IdParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const id = params.id;
        if (token.id !== id) return NextResponse.json(null, { status: 400 });

        const data = await getUserProfile(parseInt(id));
        if (!data) return NextResponse.json(null, { status: 500 });
        return data.length === 1 ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 404 });
    } catch (error) {
        return handleAPICatchError(error);
    }
}
