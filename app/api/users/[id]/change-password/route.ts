import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { changePassword } from '../../../../../lib/api';

export async function PUT(req: NextRequest, { params }) {
    try {
        const token = await getToken({ req });
        if (!token) return NextResponse.json(null, { status: 401 });

        const { userId, password, resetPasswordToken } = await req.json();
        const id = params.id;

        if (!id || !password) return NextResponse.json(null, { status: 400 });
        if ((!token && (!userId || !resetPasswordToken)) || token.id !== id) return NextResponse.json(null, { status: 401 });

        let result =  { code: 400 };

        if (userId && resetPasswordToken) result = await changePassword(parseInt(userId), password, resetPasswordToken);

        if (token.id) {
            result = await changePassword(parseInt(id), password);
        }

        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
