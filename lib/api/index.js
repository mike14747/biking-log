import runQuery from '../db';

const getInfoForAllUsers = async () => {
    const queryString = 'SELECT id, username, email, role FROM users ORDER BY id ASC;';
    const queryParams = [];
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

module.exports = {
    getInfoForAllUsers,
    registerNewUser,
    getUserProfile,
};
