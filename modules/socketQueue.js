const waitMap = new Map();
const gTimeout = 5000;

function addCommand(command, socket, callback) {
    if (!waitMap.has(command)) waitMap.set(command, new Map());
    const sockets = waitMap.get(command);
    sockets.set(socket, callback);
}

function removeCommand(command, socket, callback) {
    const sockets = waitMap.get(command);
    if (sockets == null) return;
    sockets.delete(socket);
    if (sockets.size == 0)
        waitMap.delete(command);
    if (callback != null)
        return callback({ message: 'cancelled by timeout' });
}

exports.add = function (command, socket, callback) {
    setTimeout(function () {
        removeCommand(command, socket, callback);
    }, gTimeout);
    addCommand(command, socket, callback);
};

exports.call = function (command, socket, data) {
    const commands = waitMap.get(command);
    if (commands == null) return;
    const callback = commands.get(socket);
    if (callback == null) return;
    callback(null, data);
    removeCommand(command, socket);
};
