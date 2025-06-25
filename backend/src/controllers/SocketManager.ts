require('dotenv').config()
import { Server } from "socket.io"
import { Server as HttpServer } from "node:http"
import { MongoClient } from "mongodb"

interface Connections {
  [roomId: string]: string[]
}

interface Messages {
  sender: string; message: string; timestamp: number
}

interface HandRaiseQueue {
  [roomId: string]: string[]
}

interface UserRoles {
  [socketId: string]: { role: string, username: string, avatar?: string }
}

const connections: Connections = {}
const timeOnline: { [socketId: string]: Date } = {}
const handRaiseQueue: HandRaiseQueue = {}
const userRoles: UserRoles = {}

const mongoClient = new MongoClient(process.env.MONGO_URL as string)
mongoClient.connect()
const db = mongoClient.db("huddMeet")
const messagesCollection = db.collection("messages")
const sessionsCollection = db.collection("sessions")

const connectToSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['*'],
      credentials: true
    }
  })

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id)

    socket.on("join-call", async (roomId: string, username: string, role = "viewer", avatar = "") => {
      socket.join(roomId)
      console.log(`${username} joined room: ${roomId}`)

      if (!connections[roomId]) connections[roomId] = []
      connections[roomId].push(socket.id)
      timeOnline[socket.id] = new Date()
      userRoles[socket.id] = { role, username, avatar }

      io.to(roomId).emit("user-joined", socket.id, username, connections[roomId], role, avatar)

      const history = await messagesCollection.find({ roomId }).toArray()
      history.forEach((msg) => {
        io.to(socket.id).emit("chat-message", {
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp
        })
      })
    })

    socket.on("typing", (roomId: string, username: string) => {
      socket.to(roomId).emit("typing", username)
    })

    socket.on("private-message", (toId: string, from: string, message: string) => {
      io.to(toId).emit("private-message", { from, message, timestamp: Date.now() })
    })

    socket.on("chat-message", async (roomId: string, sender: string, message: string) => {
      const timestamp = Date.now()
      await messagesCollection.insertOne({ roomId, sender, message, timestamp })
      io.to(roomId).emit("chat-message", { sender, message, timestamp })
    })

    socket.on("screen-sharing", (roomId: string, isSharing: boolean, sender: string) => {
      io.to(roomId).emit("screen-sharing", { isSharing, sender })
    })

    socket.on("raise-hand", (roomId: string, username: string) => {
      if (!handRaiseQueue[roomId]) handRaiseQueue[roomId] = []
      handRaiseQueue[roomId].push(username)
      io.to(roomId).emit("hand-raised", handRaiseQueue[roomId])
    })

    socket.on("reaction", (roomId: string, emoji: string, sender: string) => {
      io.to(roomId).emit("reaction", { emoji, sender })
    })

    socket.on("mute-all", (roomId: string) => {
      io.to(roomId).emit("mute-all")
    })

    socket.on("kick-user", (roomId: string, userId: string) => {
      io.to(userId).emit("kicked")
      io.to(roomId).emit("user-kicked", userId)
    })

    socket.on("start-recording", (roomId: string) => {
      io.to(roomId).emit("start-recording")
    })

    socket.on("stop-recording", (roomId: string) => {
      io.to(roomId).emit("stop-recording")
    })

    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id)
      rooms.forEach(roomId => {
        if (connections[roomId]) {
          connections[roomId] = connections[roomId].filter(id => id !== socket.id)
          io.to(roomId).emit("user-left", socket.id, connections[roomId])

          if (connections[roomId].length === 0) {
            delete connections[roomId]
            delete handRaiseQueue[roomId]
          }
        }
      })
    })

    socket.on("disconnect", async () => {
      const connectedTime = timeOnline[socket.id]
      const duration = connectedTime ? Math.abs(new Date().getTime() - connectedTime.getTime()) : 0
      console.log(`Client ${socket.id} disconnected after ${duration / 1000}s`)

      if (connectedTime && userRoles[socket.id]) {
        await sessionsCollection.insertOne({
          socketId: socket.id,
          username: userRoles[socket.id].username,
          role: userRoles[socket.id].role,
          avatar: userRoles[socket.id].avatar || "",
          joinedAt: connectedTime,
          disconnectedAt: new Date(),
          duration
        })
      }

      delete timeOnline[socket.id]
      delete userRoles[socket.id]
    })
  })

  return io
}

export default connectToSocket
