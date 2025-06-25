import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";

interface Connections {
  [roomId: string]: string[];
}

interface Messages {
  [roomId: string]: { sender: string; message: string; timestamp: number }[];
}

interface HandRaiseQueue {
  [roomId: string]: string[]
}

interface UserRoles {
  [socketId: string]: { role: string, username: string, avatar?: string }
}

let connections: Connections = {};
let messages: Messages = {};
let timeOnline: { [socketId: string]: Date } = {};
const handRaiseQueue: HandRaiseQueue = {}
const userRoles: UserRoles = {}

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

    socket.on("typing", (roomId: string, username: string) => {
      socket.to(roomId).emit("typing", username)
    })

    socket.on("private-message", (toId: string, from: string, message: string) => {
      io.to(toId).emit("private-message", { from, message, timestamp: Date.now() })
    })

    socket.on("screen-sharing", (roomId: string, isSharing: boolean, sender: string) => {
      io.to(roomId).emit("screen-sharing", { isSharing, sender })
    })

    socket.on("start-recording", (roomId: string) => {
      io.to(roomId).emit("start-recording")
    })

    socket.on("stop-recording", (roomId: string) => {
      io.to(roomId).emit("stop-recording")
    })

    socket.on("reaction", (roomId: string, emojis: string, senderId: string) => {
        io.to(roomId).emit("reactions", { emojis, senderId });
    });

    socket.on("raise-hand", (roomId: string, username: string) => {
      if (!handRaiseQueue[roomId]) handRaiseQueue[roomId] = []
      handRaiseQueue[roomId].push(username)
      io.to(roomId).emit("hand-raised", handRaiseQueue[roomId])
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
      const connectedTime = timeOnline[socket.id]
      const duration = connectedTime ? Math.abs(new Date().getTime() - connectedTime.getTime()) : 0
      console.log(`Client ${socket.id} disconnected after ${duration / 1000}s`)
      delete timeOnline[socket.id]
    });
  });
  return io;
};


export default connectToSocket;
