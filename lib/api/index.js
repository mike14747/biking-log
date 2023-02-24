import runQuery from '../db';
import { mailTransporter } from '../nodemailerConfig';
import { usernamePattern, emailPattern, passwordPattern } from '../formInputPatterns';

const getInfoForAllUsers = async () => {
    const queryString = 'SELECT id, username, email, role FROM users ORDER BY id ASC;';
    const queryParams = [];
    return await runQuery(queryString, queryParams);
};

const checkForAvailableUsername = async (username) => {
    const queryString = 'SELECT username FROM users WHERE username=? LIMIT 1;';
    const queryParams = [
        username,
    ];
    return await runQuery(queryString, queryParams);
};

const registerNewUser = async (username, password, email) => {
    if (!username || !password || !email) return { code: 400 };
    const pattern1 = new RegExp(usernamePattern);
    if (!pattern1.test(username)) return { code: 400 };
    const pattern2 = new RegExp(passwordPattern);
    if (!pattern2.test(password)) return { code: 400 };
    const pattern3 = new RegExp(emailPattern);
    if (!pattern3.test(email)) return { code: 400 };

    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    const today = new Date().toISOString().slice(0, 10);

    const queryString = 'INSERT INTO users (username, password, email, role, registered_date) VALUES (?, ?, ?, "user", ?);';
    const queryParams = [
        username,
        hashedPassword,
        email,
        today,
    ];
    return await runQuery(queryString, queryParams);
};

const getUserProfile = async (id) => {
    const queryString = 'SELECT id, username, email FROM users WHERE id=? LIMIT 1;';
    const queryParams = [id];
    return await runQuery(queryString, queryParams);
};

const getUserForSignin = async (username, password) => {
    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    const queryString = 'SELECT id, username, password, role FROM users WHERE username=? && password=? LIMIT 1;';
    const queryParams = [username, hashedPassword];
    return await runQuery(queryString, queryParams);
};

const updateUserUsername = async (id, username) => {
    if (!id || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!pattern.test(username)) return { code: 400 };

    const queryString = 'UPDATE users SET username=? WHERE id=?;';
    const queryParams = [username, id];
    return await runQuery(queryString, queryParams);
};

const updateUserPassword = async (id, password, token = null) => {
    if (!id || !password) return { code: 400 };
    const pattern = new RegExp(passwordPattern);
    if (!pattern.test(password)) return { code: 400 };

    if (token) {
        // since a token is being passed, get the expiration date/time of the token if it exists in the db
        const queryString = 'SELECT id, resetPasswordExpires FROM users WHERE id=? && resetPasswordToken=?;';
        const queryParams = [id, token];
        const tokenValidCheck =  await runQuery(queryString, queryParams);

        // make sure token is found and is not expired
        if (tokenValidCheck?.length !== 1) return { code: 406 };
        if (tokenValidCheck[0]?.resetPasswordExpires < new Date(Date.now())) return { code: 412 };
    }

    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    const queryString = 'UPDATE users SET password=? WHERE id=?;';
    const queryParams = [hashedPassword, id];
    return await runQuery(queryString, queryParams);
};

const updateUserEmail = async (id, email) => {
    if (!id || !email) return { code: 400 };
    const pattern = new RegExp(emailPattern);
    if (!pattern.test(email)) return { code: 400 };

    const queryString = 'UPDATE users SET email=? WHERE id=?;';
    const queryParams = [email, id];
    return await runQuery(queryString, queryParams);
};

const forgottenUsername = async (email) => {
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
        return { code: 400 };
    }
};

const resetPassword = async (username, email) => {
    if (!username || !email) return { code: 400 };

    const queryString = 'SELECT id, username, email FROM users WHERE username=? && email=? LIMIT 1;';
    const queryParams = [username, email];
    const user = await runQuery(queryString, queryParams);
    console.log({ user });

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
        return { code: 400 };
    }
};

const getRideDataByUser = async (id) => {
    const queryString = 'SELECT username FROM users WHERE username=? LIMIT 1;';
    const queryParams = [
        id,
    ];
    return await runQuery(queryString, queryParams);
};

module.exports = {
    getInfoForAllUsers,
    checkForAvailableUsername,
    registerNewUser,
    getUserProfile,
    getUserForSignin,
    updateUserUsername,
    updateUserPassword,
    updateUserEmail,
    forgottenUsername,
    resetPassword,
    getRideDataByUser,
};
