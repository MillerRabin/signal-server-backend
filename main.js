const koa = require('koa');
const fs = require('fs');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const cors = require('koa2-cors');
const config = require('./config.js');
const offers = require('./modules/offers.js');
const { Pool } = require('pg');

const response = require('./middlewares/response.js');
const responseTime = require('./middlewares/responseTime.js');

let application = new koa();
application.use(cors());
application.use(response.koa);
application.use(responseTime.koa);

offers.addController(application, '/api/offers');

function createServer(application, port) {
    return new Promise((resolve, reject) => {
        const options = (config.settings.ssl != null) ?
            {
                key: fs.readFileSync(config.settings.ssl.key),
                cert: fs.readFileSync(config.settings.ssl.cert)
            } : {};
        const server = (config.useHttp2) ? config.production ? http2.createSecureServer(options, application.callback()) :
            http2.createServer({}, application.callback()) :
            config.production ? https.createServer(options, application.callback()) :
                http.createServer(application.callback());
        server.listen(port, (err) => {
            if (err != null) return reject(err);
            return resolve();
        });
    });
}

async function createPool() {
    const pool = new Pool(config.settings.pool);
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });
    return pool;
}

async function start(application, port) {
    try {
        application.pool = await createPool(application);
        await createServer(application, port);
        console.log(`Server is listening on port ${port}`);
    } catch (err) {
        console.log(err);
    }
}

process.on('unhandledRejection', function(reason, p) {
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

start(application, config.port);
