import { NextResponse } from 'next/server';

export function handleErrorLogging(error: unknown) {
    if (error instanceof Error) {
        console.error(error.name + ': ' + error.message);
    } else {
        console.error('An unknown error occurred:', error);
    }
}

export function handleAPIError(error: unknown) {
    if (error instanceof Error) {
        console.error(error.name + ': ' + error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        console.error('An unknown error occurred:', error);
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
