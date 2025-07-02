import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, newGroupChat } from "../controllers/chat.js";


const app = express.Router();

app.use(isAuthenticated);

app.post("/new" , newGroupChat);
app.get("/my" , getMyChats)



export default app;