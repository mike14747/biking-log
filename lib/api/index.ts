import runQuery from '../db';
import { mailTransporter } from '../nodemailerConfig';
import { usernamePattern, emailPattern, passwordPattern } from '../formInputPatterns';
import { generateRandom, hashPassword } from '../cryptoUtils';

export const checkForAvailableUsername = async (username: string) => {
    const queryString = 'SELECT username FROM users WHERE username=? LIMIT 1;';
    const queryParams = [
        username,
    ];
    return await runQuery(queryString, queryParams);
};

export const getUserForSignin = async (username: string, password: string) => {

    const queryString = 'SELECT id, username, password, salt, role FROM users WHERE username=? LIMIT 1;';
    const queryParams = [username, password];
    const user = await runQuery(queryString, queryParams);

    if (user?.length !== 1) return null;

    const hashedPassword = hashPassword(password, user[0]?.salt);
    if (!hashedPassword) return null;

    if (hashedPassword === user[0].password) {
        return {
            id: user[0].id.toString(),
            username: user[0].username,
            role: user[0].role,
        };
    } else {
        return null;
    }
};

export const getInfoForAllUsers = async () => {
    const queryString = 'SELECT id, username, email, role FROM users ORDER BY id ASC;';
    const queryParams: [] = [];
    return await runQuery(queryString, queryParams);
};

export const registerNewUser = async (username: string, password: string, email: string) => {
    const pattern1 = new RegExp(usernamePattern);
    if (!username || !pattern1.test(username)) return { code: 400 };

    const pattern2 = new RegExp(passwordPattern);
    if (!password || !pattern2.test(password)) return { code: 400 };

    const pattern3 = new RegExp(emailPattern);
    if (!email || !pattern3.test(email)) return { code: 400 };

    // first make sure the username isn't already in use
    const usernameResult = await checkForAvailableUsername(username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 409 };

    // at this point, the new username must not already be in use, so make the change
    const salt = generateRandom(32);
    const hashedPassword = hashPassword(password, salt);
    if (!hashedPassword) return null;

    const today = new Date().toISOString().slice(0, 10);

    const queryString = 'INSERT INTO users (username, password, salt, email, role, registered_date) VALUES (?, ?, ?, ?, "user", ?);';
    const queryParams = [
        username,
        hashedPassword,
        salt,
        email,
        today,
    ];

    const result = await runQuery(queryString, queryParams);

    return result?.insertId ? { code: 201 } : { code: 500 };
};

export const getUserProfile = async (id: number) => {
    const queryString = 'SELECT id, username, email FROM users WHERE id=? LIMIT 1;';
    const queryParams = [id];
    return await runQuery(queryString, queryParams);
};

export const changeUsername = async (id: number, username: string) => {
    if (!id || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!pattern.test(username)) return { code: 400 };

    const queryString = 'UPDATE users SET username=? WHERE id=?;';
    const queryParams = [username, id];
    const result = await runQuery(queryString, queryParams);

    if (result.affectedRows === 0) return { code: 404 };
    if (result.changedRows === 1) return { code: 200 };
    if (result.affectedRows === 1 && result.changedRows === 0) return { code: 406 };
    return { code: 500 };
};

export const changePassword = async (id: number, password: string, token = null) => {
    if (!id || !password) return { code: 400 };
    const pattern = new RegExp(passwordPattern);
    if (!pattern.test(password)) return { code: 400 };

    if (token) {
        // since a token is being passed, get the expiration date/time of the token if it exists in the db
        const queryString = 'SELECT id, resetPasswordExpires FROM users WHERE id=? && resetPasswordToken=?;';
        const queryParams = [id, token];
        const tokenValidCheck = await runQuery(queryString, queryParams);

        // make sure token is found and is not expired
        if (tokenValidCheck?.length !== 1) return { code: 406 };
        if (tokenValidCheck[0]?.resetPasswordExpires < new Date(Date.now())) return { code: 412 };
    }

    const salt = generateRandom(32);
    const hashedPassword = hashPassword(password, salt);

    // console.log({ salt, hashedPassword, id });

    const queryString = 'UPDATE users SET password=?, salt=? WHERE id=?;';
    const queryParams = [hashedPassword, salt, id];
    const result = await runQuery(queryString, queryParams);

    if (result.affectedRows === 0) return { code: 404 };
    if (result.changedRows === 1) return { code: 200 };
    return { code: 500 };
};

export const changeEmail = async (id: number, email: string) => {
    if (!id || !email) return { code: 400 };
    const pattern = new RegExp(emailPattern);
    if (!pattern.test(email)) return { code: 400 };

    const queryString = 'UPDATE users SET email=? WHERE id=?;';
    const queryParams = [email, id];
    const result = await runQuery(queryString, queryParams);

    if (result.affectedRows === 0) return { code: 404 };
    if (result.changedRows === 1) return { code: 200 };
    if (result.affectedRows === 1 && result.changedRows === 0) return { code: 406 };
    return { code: 500 };
};

export async function deleteAccount(id: number) {
    if (!id) return { code: 400 };

    const queryString = 'DELETE from users WHERE id=?;';
    const queryParams = [id];
    const result = await runQuery(queryString, queryParams);

    if (result.affectedRows === 0) return { code: 404 };
    if (result.affectedRows === 1) return { code: 200 };
    return { code: 500 };
}

export const forgottenUsername = async (email: string) => {
    if (!email) return { code: 400 };

    const queryString = 'SELECT id, username, email FROM users WHERE email=?;';
    const queryParams = [email];
    const user = await runQuery(queryString, queryParams);

    if (user?.length > 0) {
        const mailDetails = {
            from: 'rmlbb.noreply@gmail.com',
            to: email,
            subject: 'Forgot Username',
            html: '<p>A request for your biking-log username(s) has been made for this email address.</p><p>The biking-log username(s) associated with this email address is/are:<br /><br />' + user.map(u => u.username).join('<br />') + '</p>',
        };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    } else {
        // email address doesn't match any in the database
        return { code: 404 };
    }
};

export const resetPassword = async (username: string, email: string) => {
    if (!username || !email) return { code: 400 };

    const queryString = 'SELECT id, username, email FROM users WHERE username=? && email=? LIMIT 1;';
    const queryParams = [username, email];
    const user = await runQuery(queryString, queryParams);

    if (user?.length === 1) {
        const id = user[0].id;
        // generate a reset token
        const { randomBytes } = await import('node:crypto');
        const token = randomBytes(20).toString('hex');
        const link = `${process.env.BASE_URL}/reset-link/${id}/${token}`;

        const mailDetails = {
            from: 'rmlbb.noreply@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: '<p>A password reset request for your biking-log username <strong>"' + username + '"</strong> has been made for this email address.</p><p>Click this <a href="' + link + '">link</a> to reset your password. The link will expire in 1 hour.</p><p>If you did not request a password reset, ignore this email.</p>',
        };

        // add the reset token and expiration date to the user in the db
        const expiresDate = new Date(Date.now() + (60 * 60 * 1000));
        const queryString = 'UPDATE users SET resetPasswordToken=?, resetPasswordExpires=? WHERE id=?;';
        const queryParams = [token, expiresDate, id];
        const updateResult = await runQuery(queryString, queryParams);

        if (!updateResult || updateResult.changedRows !== 1) return { code: 500 };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    } else {
        // username and email address doesn't match any user in the database
        return { code: 404 };
    }
};

export const getRideDataByUser = async (id: number) => {
    const queryString = 'SELECT username FROM users WHERE username=? LIMIT 1;';
    const queryParams = [
        id,
    ];
    return await runQuery(queryString, queryParams);
};
