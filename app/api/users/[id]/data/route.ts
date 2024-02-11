import { NextRequest, NextResponse } from 'next/server';
import { getAllRideDataByUser, addRideData } from '@/lib/api/user';
import { getToken } from 'next-auth/jwt';
import type { IdParams } from '@/types/misc-types';
import { handleAPICatchError } from '@/lib/handleCatchErrors';

// this route used to get all data for a user if the method is GET
export async function GET(request: NextRequest, { params }: IdParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const id = params.id;
        if (!id) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const data = await getAllRideDataByUser(parseInt(id));
        return data ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPICatchError(error);
    }
}

// this route used to add ride data for a single ride if the method is POST
export async function POST(request: NextRequest, { params }: IdParams) {
    const token = await getToken({ req: request });
    if (!token) return NextResponse.json(null, { status: 401 });

    const id = params.id;
    if (token?.id !== id) return NextResponse.json(null, { status: 401 });
    const { date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes } = await request.json();
    if (!id || !date || !distance) return NextResponse.json(null, { status: 400 });

    const result = await addRideData(parseInt(id), date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes);
    return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
}
