import { NextRequest, NextResponse } from 'next/server';
import { forgottenUsername } from '../../../../lib/api';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        if (email) return NextResponse.json(null, { status: 400 });

        const result = await forgottenUsername(email);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        console.log('error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
