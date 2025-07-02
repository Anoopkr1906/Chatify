import express from "express";
import { getMyProfile, login, logout, newUser, searchUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";


const app = express.Router();

app.post("/new" , singleAvatar, newUser)
app.post("/login" , login )


// after here , user must be logged in to access further routes
// so we will use isAuthenticated middleware before every route where user has to be logged in for further access .


app.get("/me" ,isAuthenticated , getMyProfile);

app.get("/logout" ,isAuthenticated , logout)

app.get("/search" ,isAuthenticated , searchUser)

export default app;