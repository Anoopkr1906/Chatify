import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js";


const app = express.Router();


app.post("/new" ,isAuthenticated ,  newGroupValidator() , validateHandler , newGroupChat);
app.get("/my" , isAuthenticated ,  getMyChats)
app.get("/my/groups" , isAuthenticated ,  getMyGroups);

app.put("/addMembers" ,isAuthenticated , addMemberValidator() , validateHandler , addMembers);
app.put("/removeMember" ,isAuthenticated ,  removeMemberValidator() , validateHandler , removeMembers);

app.delete("/leave/:id" , isAuthenticated ,  chatIdValidator() , validateHandler , leaveGroup);

app.post("/message" , isAuthenticated ,  attachmentsMulter , sendAttachmentsValidator() , validateHandler , sendAttachments);

app.get("/message/:id" , isAuthenticated , chatIdValidator() , validateHandler , getMessages)


app.route("/:id")
    .get(chatIdValidator() , isAuthenticated , validateHandler ,getChatDetails)
    .put(renameValidator() , isAuthenticated , validateHandler ,renameGroup)
    .delete(chatIdValidator() , isAuthenticated , validateHandler , deleteChat)


export default app;