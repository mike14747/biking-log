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

export default async function runQuery(queryString: string, queryParamsArr: Array<string | number>) {
    try {
        const data = await db.query(queryString, queryParamsArr);
        await db.end();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}
