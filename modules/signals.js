const WebSocket = require('ws');
const translations = require('./translations.js');

exports.create = function (server) {
    const socket = new WebSocket.Server({ server });
    socket.on('connection', (ws) => {
        ws.on('message', function (message) {
            try {
                translations.get(this, message);
            } catch (e) {
                console.log(e);
            }
        });
    });
    return socket
};

exports.getAnswer = async function (data) {
    return await translations.getAnswer(data);
};
