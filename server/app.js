import express from "express"
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/user" , userRoutes);

app.get("/", (req, res) => {
    res.send("Hello from Home")
})

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})