const queue = require('./socketQueue.js');

exports.sockets = new Map();

const gTranslationTable = {
    setDescription,
    setAnswer,
};

function send(socket, data) {
    const str = JSON.stringify(data);
    socket.send(str);
}

function setAnswer(socket, data) {
    return queue.call(data.command, socket, data);
}

function setDescription(socket, data) {
    if (data.label == null) throw new Error('label field expected');
    exports.sockets.set(data.label, socket);
}

exports.get = function (socket, message) {
    const data = JSON.parse(message);
    if (data.command == null) throw new Error('command field expected');
    const command = gTranslationTable[data.command];
    if (command == null) throw new Error(`command ${data.command} is not found`);
    command(socket, data);
};

exports.getAnswer = function (data) {
    return new Promise((resolve, reject) => {
        if (data.label == null) throw new Error('label field expected');
        if (data.offer == null) throw new Error('offer field expected');
        const socket = exports.sockets.get(data.label);
        if (socket == null) throw new Error('Answer socket is not found');
        send(socket, { command: 'getAnswer', offer: data.offer});
        queue.add('setAnswer', socket, function (err, data) {
            if (err != null)
                return reject(err);
            if (data.answer == null) reject({ message: 'answer is not found'});
            resolve({ answer: data.answer });
        });
    });
};
