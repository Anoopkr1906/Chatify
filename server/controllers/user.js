import { compare } from "bcrypt";
import {User} from "../models/user.js";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import {getOtherMember} from "../lib/helper.js"
import {Chat} from "../models/chat.js"



// create a new user and login controller and save in cookie

const newUser = TryCatch(async(req, res , next) => {

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {name , username , password , bio} = req.body;
    const file = req.file ;

    if(!file){
        return next(new ErrorHandler("Please upload avatar" , 400));
    }

    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    }

    const user = await User.create({
        name,
        bio,
        username,
        password,
        avatar,
    });

    // res.status(201).json({message : "User created successfully"});
    sendToken(res , user , 201 , "User created" );
});

const login = TryCatch(async(req , res , next) => {
    const {username , password} = req.body ;

    const user = await User.findOne({username}).select("+password");
        
    if(!user){
        return next(new ErrorHandler("Invalid Username or password" , 404));
    }

    const isPasswordMatched = await compare(password , user.password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password or username" , 404));
    }

    sendToken(res , user , 200 , `Welcome back , ${user.name}`);
});


const getMyProfile = TryCatch(async(req , res , next) => {

    const user = await User.findById(req.user).select("-password");

    if(!user){
        return next(new ErrorHandler("User not found" , 404));
    }

    res.status(200).json({
        success: true,
        user, // assuming req.user is set by an authentication middleware
    })
})

const logout = TryCatch(async(req , res) => {
    return res.status(200).cookie("chatify-token" , "" , {...cookieOptions , maxAge: 0}).json({
        success: true, 
        message: "Logged out successfully",
    })
})


const searchUser = TryCatch(async(req , res) => {

    const {name} = req.query;

    // finding all my chats
    const myChats = await User.find({
        groupChat: false , 
        members: req.user ,
    })

    // all users from my chats means friends or people I have chatted with
    const allUsersFromMyChats = myChats.map(chat => chat.members).flat();

    // finding all users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
        _id: {$nin: allUsersFromMyChats},
        name: {$regex: name , $options: "i"},
    });

    // modifying the user data to return only necessary fields
    // we will return _id , name and avatar url of the user
    const users = allUsersExceptMeAndFriends.map(({_id , name , avatar}) => ({
        _id ,
        name,
        avatar: avatar.url
    }))

    return res.status(200).json({
        success: true, 
        users,
    });
})


const sendFriendRequest = TryCatch(async(req , res , next) => {

    const {userId} = req.body;

    if (!userId) {
        return next(new ErrorHandler("User ID is required", 400));
    }

    if (userId === req.user.toString()) {
        return next(new ErrorHandler("You cannot send request to yourself", 400));
    }

    // ✅ Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    const request = await Request.findOne({
        $or: [
            {sender: req.user , receiver: userId},
            {receiver: req.user , sender: userId}
        ],
    })

    if(request){
        return next(new ErrorHandler("Request already sent" , 400))
    };

    // ✅ Check if already friends
    const existingChat = await Chat.findOne({
        members: { $all: [req.user, userId] },
        groupChat: false
    });

    if (existingChat) {
        return next(new ErrorHandler("You are already friends", 400));
    }

    await Request.create({
        sender: req.user,
        receiver: userId
    });

    emitEvent(req , NEW_REQUEST , [userId] );

    return res.status(200).json({
        success: true, 
        message: "Friend Request sent",
    })
})

const acceptFriendRequest = TryCatch(async(req , res , next) => {

    const {requestId , accept } = req.body ;

    const request = await Request.findById(requestId).populate("sender" , "name").populate("receiver" , "name");

    if(!request){
        return next(new ErrorHandler("Request not found" , 404));
    }

    if(request.receiver._id.toString() !== req.user.toString()){
        return next(new ErrorHandler("You are not authorized to accept this request" , 401))
    };

    if(!accept){
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "request deleted successfully",
        });
    }

    const members = [request.sender._id , request.receiver._id];

    await Promise.all([
        Chat.create({
            members , 
            name: `${request.sender.name} - ${request.receiver.name}`,
        }),
        request.deleteOne(),
    ]);

    
    emitEvent(req , REFETCH_CHATS , members );

    return res.status(200).json({
        success: true, 
        message: "Friend request accepted",
        senderId: request.sender._id,
    })
});

const getMyNotifications = TryCatch(async(req , res , next) => {

    const requests = await Request.find({
        receiver: req.user,
    }).populate("sender" , "name avatar");

    const allRequests = requests.map(({_id , sender}) => ({
        _id,
        sender:{
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        }
    }));

    return res.status(200).json({
        success: true,
        requests: allRequests ,
    })
});


const getMyFriends = TryCatch(async(req , res , next) => {

    const chatId = req.query.chatId;

    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members" , "name avatar");

    const friends = chats.map(({members}) => {
        const otherUser = getOtherMember(members , req.user);
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url
        };
    });

    if(chatId){
        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id));

        return res.status(200).json({
            success: true,
            availableFriends,
        }) 
    }
    else{
        return res.status(200).json({
            success: true,
            friends
        })
    }

})


export {newUser, login , getMyProfile , logout , searchUser , sendFriendRequest , acceptFriendRequest , getMyNotifications , getMyFriends};