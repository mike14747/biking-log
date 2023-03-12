import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateUserEmail } from '../../../../../lib/api';

export async function PUT(req: NextRequest, { params }) {
    // return new Response('Not working yet');
    try {
        const token = await getToken({ req });
        if (!token) return NextResponse.json(null, { status: 401 });

        const { email } = await req.json();
        const id = params.id;

        if (!id || !email) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const response = await updateUserEmail(id, email);
        if (!response) return NextResponse.json(null, { status: 500 });
        return response.affectedRows === 1 ? NextResponse.json(null, { status: 200 }) : NextResponse.json(null, { status: 404 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
