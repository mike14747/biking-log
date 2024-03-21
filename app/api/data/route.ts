import { NextRequest, NextResponse } from 'next/server';
import { getAllRideDataByUser, addRideData } from '@/lib/api/data';
import { getToken } from 'next-auth/jwt';
import { handleAPIError } from '@/lib/handleErrors';

// this route used to get all data for a user if the method is GET
export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const userId = token.id;

        const data = await getAllRideDataByUser(parseInt(userId));
        return data ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPIError(error);
    }
}

// this route used to add ride data for a single ride if the method is POST
export async function POST(request: NextRequest) {
    const token = await getToken({ req: request });
    if (!token) return NextResponse.json(null, { status: 401 });

    const userId = token.id;

    const { date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes } = await request.json();
    if (!userId || !date || !distance) return NextResponse.json(null, { status: 400 });

    const result = await addRideData(parseInt(userId), date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes);
    return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
}
