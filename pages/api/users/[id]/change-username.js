import { getToken } from 'next-auth/jwt';
import { updateUserUsername } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();

    try {
        const token = await getToken({ req });
        if (!token) return res.status(401).end();
        if (!req.query.id || !req.body.username) return res.status(400).end();
        if (token?.id !== req.query.id) return res.status(400).end();

        const response = await updateUserUsername(parseInt(req.query.id), req.body.username);
        if (!response) return res.status(500).end();
        response?.changedRows === 1 ? res.status(200).json(response) : res.status(404).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
