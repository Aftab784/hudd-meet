"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const connectToSocket = (server) => {
    const io = new socket_io_1.Server(server);
    return io;
};
exports.default = connectToSocket;
