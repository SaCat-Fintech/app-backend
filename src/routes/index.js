function routes(fastify, options, done) {
    fastify.register(require('./user/users'), { prefix: 'api/v1/users' });
    fastify.register(require('./authentication/auth'), { prefix: 'api/v1/auth' });

    done();
}

module.exports = routes;