import { getSession } from 'next-auth/react';
import { updateUserPassword } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const session = await getSession({ req });
    if (!session) return res.status(401).end();
    if (!req.query.id || !req.body.password) return res.status(400).end();
    if (session.user?.id !== parseInt(req.query.id)) return res.status(401).end();

    try {
        const response = await updateUserPassword(parseInt(req.query.id), req.body.password);
        if (!response) return res.status(500).end();
        response?.changedRows === 1 ? res.status(200).json(response) : res.status(400).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
