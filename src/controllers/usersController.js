const User = require('../models/userModel');
const axios = require('axios');
const JSON_SERVER_URL = 'http://localhost:3001';

function createUser(username, password) {
    return axios.post(`${JSON_SERVER_URL}/users`, { username, password })
        .then(response => response.data);
}

function getUsers() {
    return axios.get(`${JSON_SERVER_URL}/users`)
        .then(response => response.data);
}

function getUserById(id) {
    return axios.get(`${JSON_SERVER_URL}/users/${id}`)
        .then(response => response.data);
}

function updateUser(id, username, password) {
    return axios.put(`${JSON_SERVER_URL}/users/${id}`, { username, password })
        .then(response => response.data);
}

function deleteUser(id) {
    return axios.delete(`${JSON_SERVER_URL}/users/${id}`)
        .then(response => response.data);
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
