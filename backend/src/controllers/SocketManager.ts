import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";


let connections = {};
let messages = {};
let timeOnline = {};

const connectToSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['Get', 'Post']
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id)

    socket.on("join-call", (roomId:string, username: string) => {
       
    });

    socket.on("signal", (toId, message) => {

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
