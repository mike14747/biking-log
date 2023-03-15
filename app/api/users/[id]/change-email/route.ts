import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { changeEmail } from '../../../../../lib/api';

export async function PUT(req: NextRequest, { params }) {
    try {
        const token = await getToken({ req });
        if (!token) return NextResponse.json(null, { status: 401 });

        const { email } = await req.json();
        const id = params.id;

        if (!id || !email) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const result = await changeEmail(parseInt(id), email);
        return result.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
