import runQuery from '@/lib/db';
import { mailTransporter } from '@/lib/nodemailerConfig';
import { usernamePattern, emailPattern, passwordPattern } from '@/lib/formInputPatterns';
import { generateRandom, hashPassword } from '@/lib/cryptoUtils';
import { UserInfo, UserSignin, TokenValid, UserBasic } from '@/types/user-types';

export async function checkForAvailableUsername(username: string) {
    const queryString = 'SELECT username FROM users WHERE username=? LIMIT 1;';
    const queryParams = [
        username,
    ];
    const result = await runQuery(queryString, queryParams);
    return result?.rows;
}

export async function getUserForSignin(username: string, password: string) {
    const queryString = 'SELECT id, username, password, salt, role FROM users WHERE username=? LIMIT 1;';
    const queryParams = [username, password];
    const userData = await runQuery(queryString, queryParams);
    if (userData?.rows.length !== 1) return null;
    const user = userData.rows[0] as UserSignin;

    const hashedPassword = hashPassword(password, user?.salt);
    if (!hashedPassword) return null;

    if (hashedPassword === user.password) {
        return {
            id: user.id.toString(),
            username: user.username,
            role: user.role,
        };
    }

    return null;
}

export async function getInfoForAllUsers() {
    const queryString = 'SELECT id, username, email, role FROM users ORDER BY id ASC;';
    const queryParams: [] = [];
    return await runQuery(queryString, queryParams);
}

export async function registerNewUser(username: string, password: string, email: string) {
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
}

export async function getUserProfile(id: number) {
    const queryString = 'SELECT id, username, email FROM users WHERE id=? LIMIT 1;';
    const queryParams = [id];
    const result = await runQuery(queryString, queryParams);

    if (!result || result.rows.length !== 1) return null;

    const userRow = result?.rows[0] as UserInfo;
    return userRow;
}

export async function changeUsername(id: number, username: string) {
    if (!id || !username) return { code: 400 };
    const pattern = new RegExp(usernamePattern);
    if (!pattern.test(username)) return { code: 400 };

    const usernameResult = await checkForAvailableUsername(username);
    if (!usernameResult) return { code: 500 };
    if (usernameResult.length > 0) return { code: 406 };

    const queryString = 'UPDATE users SET username=? WHERE id=?;';
    const queryParams = [username, id];
    const result = await runQuery(queryString, queryParams);

    if (result?.rowsAffected === 0) return { code: 404 };
    if (result?.rowsAffected === 1) return { code: 200 };
    return { code: 500 };
}

export async function changePassword(id: number, password: string, token = null) {
    if (!id || !password) return { code: 400 };
    const pattern = new RegExp(passwordPattern);
    if (!pattern.test(password)) return { code: 400 };

    if (token) {
        // since a token is being passed, get the expiration date/time of the token if it exists in the db
        const queryString = 'SELECT id, reset_password_expires FROM users WHERE id=? && reset_password_token=?;';
        const queryParams = [id, token];
        const tokenValidCheck = await runQuery(queryString, queryParams);
        if (tokenValidCheck?.rows.length !== 1) return { code: 406 };
        const tokenToCheck = tokenValidCheck.rows[0] as TokenValid;

        // make sure token is found and is not expired
        if (tokenToCheck?.reset_password_expires < new Date(Date.now())) return { code: 412 };
    }

    const salt = generateRandom(32);
    const hashedPassword = hashPassword(password, salt);

    const queryString = 'UPDATE users SET password=?, salt=? WHERE id=?;';
    const queryParams = [hashedPassword, salt, id];
    const result = await runQuery(queryString, queryParams);

    if (result?.rowsAffected === 0) return { code: 404 };
    if (result?.rowsAffected === 1) return { code: 200 };
    return { code: 500 };
}

export async function changeEmail(id: number, email: string) {
    if (!id || !email) return { code: 400 };
    const pattern = new RegExp(emailPattern);
    if (!pattern.test(email)) return { code: 400 };

    const queryString = 'UPDATE users SET email=? WHERE id=?;';
    const queryParams = [email, id];
    const result = await runQuery(queryString, queryParams);

    if (result?.rowsAffected === 0) return { code: 404 };
    if (result?.rowsAffected === 1) return { code: 200 };
    return { code: 500 };
}

export async function deleteAccount(id: number) {
    if (!id) return { code: 400 };

    const queryString = 'DELETE from users WHERE id=?;';
    const queryParams = [id];
    const result = await runQuery(queryString, queryParams);

    if (result?.rowsAffected === 0) return { code: 404 };
    if (result?.rowsAffected === 1) return { code: 200 };
    return { code: 500 };
}

export async function forgottenUsername(email: string) {
    if (!email) return { code: 400 };

    const queryString = 'SELECT id, username, email FROM users WHERE email=?;';
    const queryParams = [email];
    const userData = await runQuery(queryString, queryParams);
    if (!userData) return { code: 500 };
    const usernames = userData.rows as UserBasic[];

    if (usernames.length > 0) {
        const mailDetails = {
            from: 'rmlbb.noreply@gmail.com',
            to: email,
            subject: 'Forgot Username',
            html: '<p>A request for your biking-log username(s) has been made for this email address.</p><p>The biking-log username(s) associated with this email address is/are:<br /><br />' + usernames.map(u => u.username).join('<br />') + '</p>',
        };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    } else {
        return { code: 404 };
    }
}

export async function resetPassword(username: string, email: string) {
    if (!username || !email) return { code: 400 };

    const queryString = 'SELECT id, username, email FROM users WHERE username=? && email=? LIMIT 1;';
    const queryParams = [username, email];
    const userData = await runQuery(queryString, queryParams);
    if (!userData) return { code: 500 };
    if (userData.rows.length !== 1) return { code: 404 };
    const user = userData.rows[0] as UserBasic;

    const id = user.id;
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
    const queryString2 = 'UPDATE users SET reset_password_token=?, reset_password_expires=? WHERE id=?;';
    const queryParams2 = [token, expiresDate, id];
    const updateResult = await runQuery(queryString2, queryParams2);

    if (!updateResult || updateResult.rowsAffected !== 1) return { code: 500 };

    try {
        const emailSent = await mailTransporter.sendMail(mailDetails);
        return emailSent ? { code: 200 } : { code: 500 };
    } catch (error) {
        console.log(error);
        return { code: 500 };
    }

}

export async function getRideDataByUser(id: number) {
    const queryString = 'SELECT username FROM users WHERE username=? LIMIT 1;';
    const queryParams = [id];
    return await runQuery(queryString, queryParams);
}

export async function addRideData(userId: number, date: Date, distance: number, timeDuration: string | undefined, avgSpeed: number | undefined, temperature: string, windSpeed: string, windDir: string, location: string, notes: string | undefined) {
    if (!userId || !date || !distance) return null;

    const queryString = 'INSERT INTO data (user_id, date, distance, time_duration, avg_speed, temperature, wind_speed, wind_dir, location, notes) VALUES (?, ?, ?, ?, "user", ?);';
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
