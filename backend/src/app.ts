require('dotenv').config()
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors"
import connectToSocket from "./controllers/SocketManager";
import userRoutes from "./routes/users.routes"

const app = express()
const server = createServer(app)
const io = connectToSocket(server)
const PORT = process.env.PORT as string || 3000

app.set("port", PORT)
app.use(cors())
app.use(express.json({limit: '40kb'}))
app.use(express.urlencoded({limit: '40kb', extended : true}))

// Routing
app.use("/api/v1/users", userRoutes)

// Error-handling middleware should come after routes
app.use(((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next();
}) as express.ErrorRequestHandler);

interface MainApp {
    (app: express.Express): Promise<void>;
}

const main: MainApp = async (app) => {
    try {

    const start = Date.now()    

    await mongoose.connect(process.env.MONGO_URL as string)

    const end = Date.now()

    const timeTaken = (( end - start ) / 1000).toFixed(3)

    console.log(`✅ MongoDB connected in ${timeTaken}s`);

    server.listen(app.get("port"), () => {
        console.log("🚀 Server is running on port 3000");
    })
    } catch(err) {
    console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1); // Exit the app if DB connection fails
  }
}


main(app)

