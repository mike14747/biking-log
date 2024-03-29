import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { changeEmail } from '@/lib/api/user';
import { IdParams } from '@/types/misc-types';
import { handleAPIError } from '@/lib/handleErrors';

export async function PUT(request: NextRequest, { params }: IdParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const { email } = await request.json();
        const id = params.id;

        if (!id || !email) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const result = await changeEmail(parseInt(id), email);
        return result.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPIError(error);
    }
}
