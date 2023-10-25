const fastify = require('fastify')({ logger: true });

fastify.register(require('@now-ims/fastify-firebase'));

//fastify.firebase