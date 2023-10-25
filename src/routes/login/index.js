'use strict'
const path = require('path')

module.exports = async function (fastify, opts) {

  fastify.register(require('@fastify/sensible'));
  fastify.register(require('@now-ims/fastify-firebase'), {
    cert: path.join(__dirname, 'firebase.json'),
    //projectId: '115336169151-i79cfn2ko1hsu3o17vajnesvcilrmkel.apps.googleusercontent.com',
  });

  fastify.get('/', async function (request, reply) {
    return 'login'
  })

  fastify.post('/', async function (request, reply) {
    const { username, password } = request.body;
    //const user = await fastify.firebase.auth().getUserByEmail(username);
    const create = await fastify.firebase.auth().createUserWithEmailAndPassword(username, password);
    console.log(create)
    //console.log(user)
    return `User Exists: ${username}`
  })

  //fastify.firebase.auth().createTenant('test')
}
