import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";

interface Connections {
  [roomId: string]: string[];
}

interface Messages {
  [roomId: string]: { sender: string; message: string; timestamp: number }[];
}

let connections: Connections = {};
let messages: Messages = {};
let timeOnline: { [socketId: string]: Date } = {};

const connectToSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["Get", "Post"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected: " + socket.id);

    socket.on("join-call", (roomId: string, username: string) => {
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId}`);

      if (!connections[roomId]) connections[roomId] = [];
      connections[roomId].push(socket.id);
      timeOnline[socket.id] = new Date();

      io.to(roomId).emit(
        "user-joined",
        socket.id,
        username,
        connections[roomId]
      );

      if (messages[roomId]) {
        messages[roomId].forEach((msg) => {
          io.to(socket.id).emit("chat-message", {
            sender: msg.sender,
            message: msg.message,
            timestamp: msg.timestamp,
          });
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (roomId: string, sender: string, message: string) => {
      const timestamp = Date.now();
      if(!messages[roomId]) messages[roomId] = []
      messages[roomId].push({sender, message, timestamp})

      io.to(roomId).emit("chat-message", {sender, message, timestamp})

    });

    socket.on(
      "reaction",
      (roomId: string, emojis: string, senderId: string) => {
        io.to(roomId).emit("reactions", { emojis, senderId });
      }
    );

    socket.on("raise-hand", (roomId: string, username: string) => {
      io.to(roomId).emit("hand-raised", username);
    });

    socket.on("mute-all", (roomId: string) => {
      io.to(roomId).emit("mute-all");
    });

    socket.on("kick-user", (roomId: string, userId: string) => {
      io.to(userId).emit("kicked off");
      io.to(roomId).emit("kicked user", userId);
    });

    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id)
      rooms.forEach(roomId => {
        if(connections[roomId]){ 
          connections[roomId] = connections[roomId].filter( id => id !== socket.id)
          io.to(roomId).emit("user-left", socket.id, connections[roomId])

          if (connections[roomId].length === 0) {
            delete connections[roomId]
            }
          }
        })
    });

    socket.on("disconnect", () => {
      
    });
  });
  return io;
};

export default connectToSocket;
