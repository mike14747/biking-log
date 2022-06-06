import runQuery from '../db';

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
    const { pbkdf2Sync } = await import('node:crypto');
    const hashedPassword = pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512').toString('hex');

    const queryString = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, "user");';
    const queryParams = [
        username,
        hashedPassword,
        email,
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

module.exports = {
    getInfoForAllUsers,
    checkForAvailableUsername,
    registerNewUser,
    getUserProfile,
    getUserForSignin,
};
