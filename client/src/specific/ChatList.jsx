// import React from 'react'

// function ChatList() {
//   return (
//     <div>
//       Chatlist
//     </div>
//   )
// }

// export default ChatList


import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../components/shared/ChatItem'
import { bgGradient } from '../constants/color';

function ChatList({
    w="100%" , 
    chats=[] , 
    chatId , 
    onlineUsers=[] , 
    newMessagesAlert=[
        {
            chatId: "",
            count: 0,
        }
    ],
    handleDeleteChat,
}) {

  // Safety check for chats array
  const safeChats = Array.isArray(chats) ? chats : [];

  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"} sx={{
        backgroundImage: bgGradient
    }}>

        {
            safeChats?.map((data , index) => {

                if (!data || typeof data !== 'object') {
                    return null; // Skip invalid data
                }

                const {avatar , _id , name , groupChat , members} = data ;

                // Ensure we have valid data
                if (!_id) return null;

                const newMessageAlert = newMessagesAlert.find(
                    ({chatId}) => chatId === _id
                );

                const isOnline = Array.isArray(members) ? members?.some((member) => onlineUsers.includes(_id)) : false;
                
                return (
                    <ChatItem
                        index={index}
                        newMessageAlert={newMessageAlert} 
                        isOnline={isOnline} 
                        avatar={Array.isArray(avatar) ? avatar : []}
                        name={typeof name === 'string' ? name : 'Unknown'}
                        _id={_id}
                        key={_id}
                        groupChat={Boolean(groupChat)}
                        sameSender={chatId === _id}
                        handleDeleteChat={handleDeleteChat}
                    />
                )   
            })
        }

    </Stack>
  )
}

export default ChatList

