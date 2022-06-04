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
    const queryString = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, "user");';
    const queryParams = [
        username,
        password,
        email,
    ];
    return await runQuery(queryString, queryParams);
};

const getUserProfile = async (id) => {
    const queryString = 'SELECT id, username, email FROM users ORDER BY id ASC;';
    const queryParams = [id];
    return await runQuery(queryString, queryParams);
};

const getUserForSignin = async (username) => {
    const queryString = 'SELECT id, username, password, role FROM users WHERE username=? LIMIT 1;';
    const queryParams = [username];
    return await runQuery(queryString, queryParams);
};

module.exports = {
    getInfoForAllUsers,
    checkForAvailableUsername,
    registerNewUser,
    getUserProfile,
    getUserForSignin,
};
