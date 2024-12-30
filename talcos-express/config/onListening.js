const debug = require('debug')('talcos-express:server');

function onListening(server) {
    return function () {
        const addr = server.address();
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Escuchando en: ' + bind);
    };
}

module.exports = onListening;
