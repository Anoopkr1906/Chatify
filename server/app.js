import express from "express"
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {createServer} from "http"
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import {v4 as uuid} from "uuid"
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors";
import {v2 as cloudinary} from "cloudinary"
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config({
    path: "./.env"
})

const userSocketIDs = new Map();

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
const server = createServer(app);
const io = new Server(server , {
    cors: corsOptions,
})

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Add extended: true
app.use(cors(corsOptions));

app.use("/api/v1/user" , userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin" , adminRoutes)

app.get("/", (req, res) => {
    res.send("Hello from Home")
})


io.use((socket, next) => {
    cookieParser()(socket.request , socket.request.res , 
        async(err) => {await socketAuthenticator(err , socket , next)}
        );
}) 


io.on("connection" , (socket) => {

    console.log("A user connected" , socket.id);

    const user = socket.user;

    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE ,async ({chatId , members , message})=> {
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender:{
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        }
        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };

        const membersSocket = getSockets(members);

        io.to(membersSocket).emit(NEW_MESSAGE , {
            chatId,
            message: messageForRealTime,
        });

        io.to(socket.id).emit(NEW_MESSAGE_ALERT , {
            chatId,
        });

        try {
            await Message.create(messageForDB);
        } catch (error) {
            console.log("Error while saving message to DB", error);
        }

        console.log("New message received", messageForRealTime); 
    })
    socket.on("disconnect" , () => {
        console.log("User disconnected" , socket.id);
        userSocketIDs.delete(user._id.toString());
    })
})

app.use(errorMiddleware)

server.listen(PORT , () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
})


export {userSocketIDs}