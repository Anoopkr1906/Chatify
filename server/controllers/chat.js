import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";


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


const getMyGroups = TryCatch(async(req , res , next) => {

    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
    }).populate("members" , "name avatar");

    const groups = chats.map(({members , groupChat , _id , name}) => ({
        _id,
        groupChat,
        name,
        avatar: members.slice(0,3).map(({avatar}) => avatar.url),
    }));

    return res.status(200).json({
        success: true,
        groups,
    })
})


const addMembers = TryCatch(async(req , res , next) => {

    const {chatId , members} = req.body;

    if(!members || members.length < 1) {
        return next(new ErrorHandler("Please provide members" , 400))
    }

    const chat = await Chat.findById(chatId);

    if(!chat){
        return next(new ErrorHandler("chat not found" , 404));
    }

    if(!chat.groupChat){
        return next(new ErrorHandler("This is not groupChat" , 400));
    }

    if(chat.creator.toString() !== req.user.toString()){
        return next(new ErrorHandler("U are not allowed to add members" , 403));
    }


    const allNewMembersPromise = members.map(i => User.findById(i , "name"));

    const allNewMembers = await Promise.all(allNewMembersPromise);

    const uniqueMembers = allNewMembers.filter(
        (i) => !chat.members.includes(i._id.toString())
    ).map((i) => i._id);

    chat.members.push(...uniqueMembers);

    if(chat.members.length > 100){
        return next(new ErrorHandler("Group members limit reached" , 400));
    }

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(" , ");

    emitEvent(req , ALERT , chat.members , `${allUsersName} has been added to ${chat.name} group`);

    emitEvent(req , REFETCH_CHATS , chat.members)

    return res.status(200).json({
        success: true,
        message: "Members added successfully",
    })
})


const leaveGroup = TryCatch(async(req , res , next) => {

    const chatId = req.params.id ;

    const chat = await Chat.findById(chatId);

    if(!chat){
        return next(new ErrorHandler("Chat not found" , 404));
    }

    if(!chat.groupChat){
        return next(new ErrorHandler("This is not a group chat" , 400));
    }

    const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString()
    );

    if(remainingMembers.length < 3){
        return next(new ErrorHandler("Grp must have atleast 3 members" , 400));
    }

    if(chat.creator.toString() === req.user.toString()){
        const randomMember = Math.floor(Math.random*remainingMembers.length);
        const newCreator = remainingMembers[randomMember];

        chat.creator = newCreator;
    }

    chat.members = remainingMembers

    const [user] = await Promise.all([
        User.findById(req.user , "name") , chat.save()
    ])

    emitEvent(req , ALERT , chat.members , `${user.name} has left the group`);

    emitEvent(req , REFETCH_CHATS , chat.members);

    return res.status(200).json({
        success: true,
        message: "Group leaved successfully"
    })

})

const removeMembers = TryCatch(async(req , res , next) => {

    const {userId , chatId} = req.body;

    const [chat , userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId , "name")
    ])

    if(!chat){
        return next(new ErrorHandler("Chat not found" , 404));
    }

    if(!chat.groupChat){
        return next(new ErrorHandler("This is not a group chat" , 400));
    }

    if(chat.creator.toString() !== req.user.toString()){
        return next(new ErrorHandler("U are not allowed to add members" , 403));
    }

    if(chat.members.length <= 3){
        return next(new ErrorHandler("Group must have atleast 3 members" , 400));
    }

    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
    );


    await chat.save() ;

    emitEvent(req , ALERT , chat.members , `${userThatWillBeRemoved.name} has been removed from he group`);

    emitEvent(req , REFETCH_CHATS , chat.members);

    return res.status(200).json({
        success: true,
        message: "Members removed successfully"
    })

})


const sendAttachments = TryCatch(async(req ,res , next) => {

    const {chatId} = req.body;

    const [chat , me] = await Promise.all([Chat.findById(chatId) , User.findById(req.user , "name")]);

    if(!chat){
        return next(new ErrorHandler("Chat not found" , 404));
    }

    const files = req.files || [];

    if(files.length < 1){
        return next(new ErrorHandler("Please provide files" , 400));
    }

    const attachments = [];

    const messageForDB = {
        content: "",
        attachments ,
        sender: me._id,
        chat: chatId,
    };

    const messageForRealTime = {
        ...messageForDB,
        sender: {
            name: me.name,
            _id: me._id,
        },
    };

    const message = await Message.create(messageForDB);

    emitEvent(req , NEW_ATTACHMENT , chat.members , {
        message : messageForRealTime,
        chatId, 
    });

    emitEvent(req , NEW_MESSAGE_ALERT , chat.members , { chatId });

    return res.status(200).json({
        success: true,
        message , 
    })
})



export {newGroupChat , getMyChats , getMyGroups , addMembers , removeMembers , leaveGroup , sendAttachments};