const http = require('http');
const logger = require('./utils/logger');

const requestLogger = logger('server');

const server = http.createServer();
const port = 3000;
server.listen(port);

server.on('listening', () => console.log(`Server listening on port ${port}`));

server.on('request', (req, resp) => {

    if (req.url === '/healthcheck' && req.method === 'GET') {
        resp.writeHead(200, { 'Content-Type': 'text/plain' });
        resp.end('healthcheck passed');
        requestLogger.info(`${req.method} ${req.url} ${resp.statusCode}`);
    } else {
        resp.writeHead(404, { 'Content-Type': 'text/plain' });
        resp.end('Not Found');
        requestLogger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
    }
});