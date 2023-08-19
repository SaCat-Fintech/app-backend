function routes(fastify, options, done) {
    fastify.register(require('./user/users'), { prefix: 'api/v1/users' });

    done();
}

module.exports = routes;