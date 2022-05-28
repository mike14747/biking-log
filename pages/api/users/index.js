// this will get all users and their info (but not riding data) if the http method is GET... and only if the user is logged in with the role of admin

// this route is also used for registering a new user... if the http method is POST

// import { getSession } from 'next-auth/react';
import { getInfoForAllUsers, registerNewUser } from '../../../lib/api';

export default async function users(req, res) {
    if (req.method === 'GET') {
        // const session = await getSession({ req });
        // if (!session?.user?.role || session.user.role !== 'admin') res.status(401).end();

        try {
            const response = await getInfoForAllUsers();
            response ? res.status(200).json(response) : res.status(500).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    } else if (req.method === 'POST') {
        // this is where a new user is trying to register
        if (!req.body.username || !req.body.password || !req.body.email) res.status(401).end();

        try {
            const response = await registerNewUser(req.body.username, req.body.password, req.body.email);
            response ? res.status(201).end() : res.status(500).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    } else {
        res.status(401).end();
    }
}
