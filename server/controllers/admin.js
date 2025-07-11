import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/features.js";


const adminLogin = TryCatch(async(req , res , next) => {
    const {secretKey} = req.body;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "Anoop@admin123";

    const isMatched = secretKey === adminSecretKey;

    if(!isMatched){
        return next(new ErrorHandler("Invalid Admin key" , 401));
    }

    const token = jwt.sign(secretKey , process.env.JWT_SECRET);

    return res.status(200).cookie("chatify-admin-token" , token ,{
        ...cookieOptions , maxAge : 1000*60*15
    }).json({
        success: true,
        message: "Admin logged in successfully , Welcome Boss :)  *_*  ^_^ ",
    });

});

const adminLogout = TryCatch(async(req , res , next) => {
    return res.status(200).cookie("chatify-admin-token" , "" , {
        ...cookieOptions , maxAge: 0,
    }).json({
        success: true,
        message: "Admin logged out successfully",
    });
})

const getAdminData = TryCatch( async(req , res , next) => {
    return res.status(200).json({
        admin: true,
    })
})

const allUsers = TryCatch(async(req , res , next) => {

    console.log("allUsers endpoint hit"); // ✅ Debug log

    const users = await User.find({});

    console.log("Found users count:", users.length); // ✅ Debug log

    const transformedUsers = await Promise.all(
        users.map(async({name, username, avatar, _id}) => {
            const [groups, friends] = await Promise.all([
                Chat.countDocuments({groupChat: true, members: _id}),
                Chat.countDocuments({groupChat: false, members: _id})
            ]);

            return {
                name,
                username,
                avatar: avatar?.url || "",
                _id,
                groups,
                friends
            };
        })
    );


    return res.status(200).json({
        success: true,
        users: transformedUsers,
    })

});

const allChats = TryCatch(async(req , res , next) => {
    console.log("allChats endpoint hit"); // ✅ Debug log

    const chats = await Chat.find({}).populate("members", "name avatar").populate("creator", "name avatar");

    console.log("Found chats count:", chats.length); // ✅ Debug log

    const transformedChats = await Promise.all(
        chats.map(async ({members , _id , groupChat , name , creator}) => {

            const totalMessages = await Message.countDocuments({chat: _id});

            return {
                _id , 
                groupChat ,
                name ,
                avatar: members.slice(0,3).map((member) => member.avatar.url),
                members: members.map(({_id , name , avatar}) => ({
                    _id,
                    name,
                    avatar: avatar?.url || "",
                })),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar?.url || ""
                },
                totalMembers: members.length,
                totalMessages,

            }
        })
    );

    return res.status(200).json({
        success: true,
        chats: transformedChats,
    })
})

const allMessages = TryCatch(async(req , res , next) => {

    console.log("allMessages endpoint hit"); // ✅ Debug log

    const messages = await Message.find({}).populate("sender", "name avatar").populate("chat" , "groupChat name");

    console.log("Found messages count:", messages.length); // ✅ Debug log

    const transformedMessages = messages.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        attachments: attachments || [] ,
        content : content || "",
        createdAt,
        chat: chat._id,
        groupChat: chat?.groupChat || false ,
        sender: {
            _id: sender?._id,
            name: sender?.name,
            avatar: sender?.avatar?.url || "",
        },
        
    }))

    return res.status(200).json({
        success: true,
        message : transformedMessages,
    })

});

const getDashboardStats = TryCatch(async(req , res ) => {

    const [groupsCount , usersCount , messagesCount , totalChatsCount ] = await Promise.all([
        Chat.countDocuments({groupChat: true}),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ]);

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate()-7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today
        }
    }).select("createdAt");

    const messages = new Array(7).fill(0);

    last7DaysMessages.forEach((message) => {
        const indexApprox = (today.getTime()-message.createdAt.getTime())/(1000*60*60*24);
        const index = Math.floor(indexApprox);

        messages[6-index]++;
    })

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
    };

    return res.status(200).json({
        success: true,
        stats,
    });

}) 



export {allUsers , allChats , allMessages , getDashboardStats , adminLogin , adminLogout , getAdminData}