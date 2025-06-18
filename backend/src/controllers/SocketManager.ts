import { Server } from "socket.io"
import { Server as HttpServer } from "node:http"

const connectToSocket = (server: HttpServer) => {
    const io = new Server(server)
    
    return io;
}

export default connectToSocket;