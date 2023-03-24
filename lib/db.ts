import { connect } from '@planetscale/database';

const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
};

const db = connect(config);

export default async function runQuery(queryString: string, queryParamsArr: Array<string | number | null>) {
    try {
        return await db.execute(queryString, queryParamsArr);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.log('error:', errorMessage);
        return null;
    }
}
