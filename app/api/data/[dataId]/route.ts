import { NextRequest, NextResponse } from 'next/server';
import { editRideData, deleteRideData } from '@/lib/api/data';
import { getToken } from 'next-auth/jwt';
import type { DataParams } from '@/types/misc-types';
import { handleAPICatchError } from '@/lib/handleCatchErrors';

// this route used to edit data for a single ride if the http method is PUT
export async function PUT(request: NextRequest, { params }: DataParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const userId = token.id;
        const { dataId } = params;

        const { date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes } = await request.json();
        if (!dataId || !date || !distance) return NextResponse.json(null, { status: 400 });

        const result = await editRideData(parseInt(dataId), parseInt(userId), date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes);
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPICatchError(error);
    }
}

// this route used to delete data for a single ride if the http method is DELETE
export async function DELETE(request: NextRequest, { params }: DataParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const userId = token.id;
        const { dataId } = params;

        const result = await deleteRideData(parseInt(dataId), parseInt(userId));
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPICatchError(error);
    }
}
