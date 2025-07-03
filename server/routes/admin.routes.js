import express from "express"
import { allUsers } from "../controllers/admin.js";
import { allChats } from "../controllers/admin.js";
import { allMessages } from "../controllers/admin.js";
import { getDashboardStats } from "../controllers/admin.js";
import { adminLogin } from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminLogout } from "../controllers/admin.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import { getAdminData } from "../controllers/admin.js";

const app = express();


app.post("/verify" ,adminLoginValidator() , validateHandler , adminLogin);
app.get("/logout" , adminLogout);

// Admin routes for fetching data
// These routes are for admin to fetch all users, chats, messages and dashboard stats
// these routes can only be accessed by admin so a middleware for admin authentication

app.get("/" , isAdminAuthenticated , getAdminData);
app.get("/users" , isAdminAuthenticated , allUsers);
app.get("/chats" , isAdminAuthenticated , allChats);
app.get("/messages" ,isAdminAuthenticated , allMessages);
app.get("/stats" ,isAdminAuthenticated , getDashboardStats);

export default app;