import express from "express";
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";


const app = express.Router();

app.post("/new" , singleAvatar , registerValidator() , validateHandler , newUser)
app.post("/login" , loginValidator() , validateHandler , login )


// after here , user must be logged in to access further routes
// so we will use isAuthenticated middleware before every route where user has to be logged in for further access .


app.get("/me" ,isAuthenticated , getMyProfile);

app.get("/logout" ,isAuthenticated , logout)

app.get("/search" ,isAuthenticated , searchUser)

app.put("/sendRequest" , isAuthenticated, sendRequestValidator() , validateHandler , sendFriendRequest);
app.put("/acceptRequest" ,isAuthenticated , acceptRequestValidator() , validateHandler , acceptFriendRequest);

app.get("/notifications" ,isAuthenticated, getMyNotifications);

app.get("/friends" ,isAuthenticated, getMyFriends)

export default app;