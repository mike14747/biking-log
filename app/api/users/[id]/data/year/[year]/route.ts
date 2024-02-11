import { NextRequest, NextResponse } from 'next/server';
import { getSingleYearRideDataByUser } from '@/lib/api/user';
import { getToken } from 'next-auth/jwt';
import type { YearParams } from '@/types/misc-types';
import { handleAPICatchError } from '@/lib/handleCatchErrors';

// this route used to get all data for a user if the method is GET
export async function GET(request: NextRequest, { params }: YearParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const { id, year } = params;
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });
        if (!id) return NextResponse.json(null, { status: 400 });

        const data = await getSingleYearRideDataByUser(parseInt(id), parseInt(year));
        return data ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPICatchError(error);
    }
}
