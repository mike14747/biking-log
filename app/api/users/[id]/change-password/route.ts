import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { changePassword } from '../../../../../lib/api';

export async function PUT(req: NextRequest, { params }) {
    try {
        const token = await getToken({ req });

        const { userId, password, resetPasswordToken } = await req.json();
        const id = params.id;
        if (!id || !password) return NextResponse.json(null, { status: 400 });

        if (token && token.id === id) {
            const result = await changePassword(parseInt(id), password);
            return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
        }

        if (userId && resetPasswordToken) {
            const result = await changePassword(parseInt(userId), password, resetPasswordToken);
            return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
        }

        return NextResponse.json(null, { status: 400 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
