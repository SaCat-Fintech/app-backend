const authController = require('../../controllers/authController');

function authRoutes(fastify, options, done) {
    fastify.post('/sign-up', async (request, reply) => {
        const { username, password } = request.body;
        return authController.createUser(username, password);
    });

    fastify.post('/sign-in', async (request, reply) => {
        const { username, password } = request.body;
        return authController.loginUser(username, password);
    });
    done();
}

module.exports = authRoutes;
