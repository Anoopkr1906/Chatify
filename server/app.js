import express from "express"
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createUser } from "./seeders/user.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/user" , userRoutes);
app.use("/chat", chatRoutes);
app.use("/admin" , adminRoutes)

app.get("/", (req, res) => {
    res.send("Hello from Home")
})

app.use(errorMiddleware)

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})