import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utils/features.js";


const newGroupChat = TryCatch(async(req ,res , next) => {
    const {name , members} = req.body;

    if(members.length < 2){
        return next(new ErrorHandler("Please provide a valid name and at least three members for the group chat", 400));
    };

    const allMembers = [...members , req.user];

    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers,
    })

    emitEvent(req , ALERT , allMembers , `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS , members)

    return res.status(201).json({
        success: true,
        message: "Group chat created successfully",
    });
})


const getMyChats = TryCatch(async(req ,res , next) => {
    const chats = await Chat.find({members: req.user}).populate(
        "members",
        "name username avatar"
    );

    const transformedChats = chats.map(({_id , name , members , groupChat}) => {

        const otherMember = getOtherMember(members , req.user);

        return {
            _id ,
            name: groupChat? name : otherMember.name,
            groupChat ,
            avatar: groupChat ? members.slice(0,3).map(({avatar}) => avatar.url) : [otherMember.avatar.url],
            members:members.reduce((prev , curr) => {
                if(curr._id.toString() !== req.user.toString()){
                    prev.push(curr._id)
                }

                return prev ;
            },[]),
            
        }
    })

    return res.status(201).json({
        success: true,
        transformedChats,
    });
})



export {newGroupChat , getMyChats};