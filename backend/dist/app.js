"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const PORT = process.env.PORT || 3000;
app.set("port", PORT);
app.use((0, cors_1.default)());
app.use((0, express_1.default)());
app.get("/home", (req, res) => {
    res.json({ "hello": "World!!!!!" });
    return;
});
const main = (app) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const start = Date.now();
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        const end = Date.now();
        const timeTaken = ((end - start) / 1000).toFixed(3);
        console.log(`✅ MongoDB connected in ${timeTaken}s`);
        server.listen(app.get("port"), () => {
            console.log("🚀 Server is running on port 3000");
        });
    }
    catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1); // Exit the app if DB connection fails
    }
});
main(app);
