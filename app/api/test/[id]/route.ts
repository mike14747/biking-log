import { NextRequest, NextResponse } from 'next/server';

import mysql, { ServerlessMysql } from 'serverless-mysql';

const db: ServerlessMysql = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    },
});

async function runQuery(queryString: string, queryParamsArr: Array<string | number>) {
    try {
        const data = await db.query(queryString, queryParamsArr);
        await db.end();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserProfile = async (id: number) => {
    const queryString = 'SELECT id, username, email FROM users WHERE id=? LIMIT 1;';
    const queryParams = [id];
    return await runQuery(queryString, queryParams);
};

type ParamsType = {
    params: {
        id: string;
    }
}

export async function GET(request: NextRequest, { params }: ParamsType) {
    const id = params.id;
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    console.log({ msg: 'Hello ' + id + '! Status is: ' + status + '.' });

    try {
        const data = await getUserProfile(parseInt(id));
        if (!data) return NextResponse.json(null, { status: 500 });
        return JSON.parse(JSON.stringify(data)).length === 1 ? NextResponse.json(data, { status: 200 }) : NextResponse.json(null, { status: 404 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.log('error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
