// this route will get all user info for a single user (but not riding data) by id if the http method is GET

import { getToken } from 'next-auth/jwt';
import { getUserProfile } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'GET') return res.status(401).end();
    if (!req.query.id) return res.status(400).end();

    try {
        const token = await getToken({ req });
        if (!token) return res.status(401).end();
        if (token.id !== req.query.id) return res.status(400).end();

        const response = await getUserProfile(parseInt(req.query.id));
        if (!response) return res.status(500).end();
        response?.length === 1 ? res.status(200).json(response) : res.status(404).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
