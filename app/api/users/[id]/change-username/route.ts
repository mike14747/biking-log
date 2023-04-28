import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { changeUsername } from '@/lib/api/user';
import { IdParams } from '@/types/index';

export async function PUT(request: NextRequest, { params }: IdParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const { username } = await request.json();
        const id = params.id;

        if (!id || !username) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const result = await changeUsername(parseInt(id), username);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.log('error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
