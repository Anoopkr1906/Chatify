import express from "express"

const app = express();
import userRoutes from "./routes/user.routes.js";

app.use("/user" , userRoutes);

app.get("/", (req, res) => {
    res.send("Hello from Home")
})

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
})