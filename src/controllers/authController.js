const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { auth } = require('../config/firebaseConfig');
async function createUser(username, password) {
    try {
        const user = await createUserWithEmailAndPassword(auth, username, password);
        console.log(user);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function loginUser(username, password) {
    try {
        const user = await signInWithEmailAndPassword(auth, username, password);
        console.log(user);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    createUser,
    loginUser
};
