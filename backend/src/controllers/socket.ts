import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: [
            "Get", 
            "Post"
        ]
        
    }
})

io.on("connection", (socket)=> {
    console.log("New User Connected: ", socket.id)
})