const fastify = require('fastify')();

fastify.register(require('./routes/index'));

const PORT = 3000;
fastify.listen(PORT, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
