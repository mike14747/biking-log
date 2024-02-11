import runQuery from '@/lib/db';

export async function getAllRideDataByUser(id: number) {
    const queryString = 'SELECT * FROM data WHERE userId=?;';
    const queryParams = [id];
    return await runQuery(queryString, queryParams);
}

export async function getSingleYearRideDataByUser(userId: number, year: number) {
    const queryString = 'SELECT * FROM data WHERE user_id=? && year=?;';
    const queryParams = [userId, year];
    return await runQuery(queryString, queryParams);
}

export async function addRideData(userId: number, date: Date, distance: number, timeDuration: string | undefined, avgSpeed: number | undefined, temperature: string, windSpeed: string, windDir: string, location: string, notes: string | undefined) {
    if (!userId || !date || !distance) return null;

    const queryString = 'INSERT INTO data (user_id, date, distance, time_duration, avg_speed, temperature, wind_speed, wind_dir, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    const queryParams = [
        userId,
        date,
        distance,
        timeDuration || '',
        avgSpeed || null,
        temperature || '',
        windSpeed || '',
        windDir || '',
        location || '',
        notes || '',
    ];

    const result = await runQuery(queryString, queryParams);

    return result?.insertId ? { code: 201 } : { code: 500 };
}

export async function editRideData(dataId: number, userId: number, date: Date, distance: number, timeDuration: string | undefined, avgSpeed: number | undefined, temperature: string, windSpeed: string, windDir: string, location: string, notes: string | undefined) {
    if (!dataId || !date || !distance) return null;

    const queryString = 'UPDATE data SET date=?, distance=?, time_duration=?, avg_speed=?, temperature=?, wind_speed=?, wind_dir=?, location=?, notes=?) WHERE id=? && user_id=? LIMIT 1';
    const queryParams = [
        date,
        distance,
        timeDuration || '',
        avgSpeed || null,
        temperature || '',
        windSpeed || '',
        windDir || '',
        location || '',
        notes || '',
        dataId,
        userId,
    ];

    const result = await runQuery(queryString, queryParams);

    return result?.rowsAffected === 1 ? { code: 200 } : { code: 500 };
}

export async function deleteRideData(dataId: number, userId: number) {
    if (!dataId) return null;

    const queryString = 'DELETE FROM data WHERE id=? && userId=?';
    const queryParams = [dataId, userId];
    const result = await runQuery(queryString, queryParams);

    if (result?.rowsAffected === 0) return { code: 404 };
    if (result?.rowsAffected === 1) return { code: 200 };
    return { code: 500 };

}
