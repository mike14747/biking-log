// this route will get all user info for a single user (but not riding data) if the http method is GET

// this route can also be used to edit user info if the http method is PUT

import { getSession } from 'next-auth/react';
import { getUserProfile } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method === 'GET') {
        const session = await getSession({ req });
        if (!session) return res.status(401).end();
        if (!req.query.username) return res.status(400).end();
        if (session.user?.name !== req.query.username) return res.status(401).end();

        try {
            const response = await getUserProfile(req.query.username);
            if (!response) return res.status(500).end();
            response?.length === 1 ? res.status(200).json(response) : res.status(400).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    } else if (req.method === 'PUT') {
        res.status(401).end();
    } else {
        res.status(401).end();
    }
}
