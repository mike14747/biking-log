import { NextRequest, NextResponse } from 'next/server';
import { editRideData, deleteRideData } from '@/lib/api/user';
import { getToken } from 'next-auth/jwt';
import type { IdParams, DataParams } from '@/types/misc-types';
import { handleAPICatchError } from '@/lib/handleCatchErrors';

// this route used to edit data for a single ride if the http method is PUT
export async function PUT(request: NextRequest, { params }: IdParams) {
    try {
        const token = await getToken({ req: request });
        if (!token) return NextResponse.json(null, { status: 401 });

        const id = params.id;
        if (!id) return NextResponse.json(null, { status: 400 });
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });

        const { date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes } = await request.json();
        if (!id || !date || !distance) return NextResponse.json(null, { status: 400 });

        const result = await editRideData(parseInt(id), date, distance, timeDuration, avgSpeed, temperature, windSpeed, windDir, location, notes);
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

        const { id, dataId } = params;
        if (token?.id !== id) return NextResponse.json(null, { status: 401 });
        if (!id || !dataId) return NextResponse.json(null, { status: 400 });

        const result = await deleteRideData(parseInt(dataId));
        return result?.code ? NextResponse.json(null, { status: result.code }) : NextResponse.json(null, { status: 500 });
    } catch (error) {
        return handleAPICatchError(error);
    }
}
