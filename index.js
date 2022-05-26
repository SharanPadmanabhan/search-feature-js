const https = require('http');
const path = require('path');

const dotenv = require('dotenv');
const express = require('express');
const app = express();

const liveReload = require('livereload');
const connectLiveReload = require('connect-livereload');

const livereloadServer = liveReload.createServer();
livereloadServer.watch(path.join(__dirname, 'src'));

livereloadServer.server.once('connection', () => {
    setTimeout(() => {
        livereloadServer.refresh('/');
    }, 10);
});

app.use(connectLiveReload());

dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.port || process.env.PORT || 5000;
const HOST = process.env.host || process.env.HOST || '127.0.0.1';

app.use(express.json());

let routes = ['assets', 'components', 'styles', 'scripts', 'fonts', 'utils', 'types'];
routes.forEach((route) => {
    app.use(`/${route}`, express.static(path.join(__dirname, 'src', route)));
});

app.get('/', (request, response) => {
    response.status(200).sendFile(path.join(__dirname, 'src', 'index.html'));
});

const server = https.createServer(app);
try {
    server.listen(PORT, HOST, () => {
        let DATE = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium', hour12: true }).toUpperCase();
        console.log(`⚡ [server] App started at http://${HOST}:${PORT} on ${DATE}`);
    });
} catch (error) {
    server.close();
}
