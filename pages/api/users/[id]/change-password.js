import { getToken } from 'next-auth/jwt';
import { updateUserPassword } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();

    try {
        const token = await getToken({ req });
        if (!req.body.password) return res.status(400).end();
        if (!token && (!req.body.userId || !req.body.resetPasswordToken)) return res.status(401).end();

        let response;
        if (token) {
            response = await updateUserPassword(parseInt(token.id), req.body.password);
        } else if (req.body.userId && req.body.password && req.body.resetPasswordToken) {
            response = await updateUserPassword(parseInt(req.body.userId), req.body.password, req.body.resetPasswordToken);
        } else {
            return res.status(402).end();
        }

        if (!response) return res.status(500).end();
        response?.changedRows === 1 ? res.status(200).json(response) : res.status(404).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
