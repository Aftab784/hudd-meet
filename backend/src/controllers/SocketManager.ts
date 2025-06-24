import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";

interface Connections {
  [roomId: string]: string[]
}

interface Messages {
  [roomId: string]: { sender: string; message: string; timestamp: number }[]
}

let connections : Connections = {};
let messages: Messages = {};
let timeOnline: { [socketId: string]: Date } = {};

const connectToSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['Get', 'Post']
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected: " + socket.id)

    socket.on("join-call", (roomId:string, username: string) => {
        socket.join(roomId)
      console.log(`${username} joined room: ${roomId}`)

      if (!connections[roomId]) connections[roomId] = []
      connections[roomId].push(socket.id)
      timeOnline[socket.id] = new Date()

      io.to(roomId).emit("user-joined", socket.id, username, connections[roomId])

      if (messages[roomId]) {
        messages[roomId].forEach((msg) => {
          io.to(socket.id).emit("chat-message", {
            sender: msg.sender,
            message: msg.message,
            timestamp: msg.timestamp
          })
        })
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {

    });
    
    socket.on("reaction", ()=> {
        
    })
    
    socket.on("raise-hand", ()=> {

    })

    socket.on("mute-all", ()=> {

    })
    
    socket.on("kick-user", ()=> {
        
    })
    
    socket.on("disconnecting", ()=> {
        
    })
    
    socket.on("disconnect", () => {
    
    });

  });
  return io;
};

export default connectToSocket;
