const koa = require('koa');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('koa2-cors');
const config = require('./config.js');
const offers = require('./modules/offers.js');

const response = require('./middlewares/response.js');
const responseTime = require('./middlewares/responseTime.js');
const signals = require('./modules/signals.js');

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
        const server = config.production ? https.createServer(options, application.callback()) :
                                           http.createServer(application.callback());
        server.listen(port, (err) => {
            if (err != null) return reject(err);
            return resolve(server);
        });
    });
}

createServer(application, config.port).then((server) => {
    console.log(`Server is listening on ${config.port}`);
    signals.create(server);
    console.log(`Socket is listening on ${config.port}`);
});



