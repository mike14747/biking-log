import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '../../../../lib/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.userme || !body.email) return NextResponse.json(null, { status: 400 });

        const result = await resetPassword(body.username, body.email);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
