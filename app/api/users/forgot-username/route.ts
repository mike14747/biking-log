import { NextRequest, NextResponse } from 'next/server';
import { forgottenUsername } from '@/lib/api/user';
import { handleAPIError } from '@/lib/handleErrors';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        if (email) return NextResponse.json(null, { status: 400 });

        const result = await forgottenUsername(email);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPIError(error);
    }
}
