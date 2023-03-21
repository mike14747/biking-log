import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    },
});

export default async function runQuery(queryString, queryParamsArr) {
    try {
        const data = await db.query(queryString, queryParamsArr);
        await db.end();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
