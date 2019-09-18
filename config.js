const fs = require('fs');

const productionSettings = {
    ssl: {
        key: '/etc/letsencrypt/live/signal.intention.tech/privkey.pem',
        cert: '/etc/letsencrypt/live/signal.intention.tech/fullchain.pem'
    },
    pool: {
        host: 'localhost',
        user: 'master',
        database: 'signal',
        port: 5441,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
    }
};

const developSettings = {};

if (exports.production == null)
    exports.production = (process.argv[2] != 'debug');

exports.useHttp2 = false;
exports.port = process.env.PORT | 8086;

exports.settings = exports.production ? productionSettings : developSettings;

if (exports.settings.pool == null) {
    const str = fs.readFileSync('./credentials.json', { encoding: 'utf-8'});
    exports.settings.pool = JSON.parse(str).databasePool;
}
