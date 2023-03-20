import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { deleteAccount } from '../../../../../lib/api';

export async function DELETE(request: NextRequest, { params }) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });
        const id = params.id;

        if (!id) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const result = await deleteAccount(parseInt(id));
        return result.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
