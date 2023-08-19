const usersController = require('../../controllers/usersController');

function userRoutes(fastify, options, done) {
    fastify.post('/', async (request, reply) => {
        const { username, password } = request.body;
        const user = usersController.createUser(username, password);
        return user;
    });

    fastify.get('/', async (request, reply) => {
        const users = usersController.getUsers();
        return users;
    });

    fastify.get('/:id', async (request, reply) => {
        const userId = parseInt(request.params.id);
        const user = usersController.getUserById(userId);
        return user;
    });

    fastify.put('/:id', async (request, reply) => {
        const userId = parseInt(request.params.id);
        const { username, password } = request.body;
        const user = usersController.updateUser(userId, username, password);
        return user;
    });

    fastify.delete('/:id', async (request, reply) => {
        const userId = parseInt(request.params.id);
        const success = usersController.deleteUser(userId);
        return { success };
    });

    done();
}

module.exports = userRoutes;
