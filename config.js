const productionSettings = {
    ssl: {
        key: '/etc/letsencrypt/live/signal.intention.tech/privkey.pem',
        cert: '/etc/letsencrypt/live/signal.intention.tech/fullchain.pem'
    }
};

const developSettings = {};

if (exports.production == null)
    exports.production = (process.argv[2] != 'debug');

exports.port = process.env.PORT | 8086;

exports.settings = exports.production ? productionSettings : developSettings;
