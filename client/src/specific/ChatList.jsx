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
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"} sx={{
        backgroundImage: bgGradient
    }}>

        {
            chats?.map((data , index) => {

                const {avatar , _id , name , groupChat , members} = data ;

                const newMessageAlert = newMessagesAlert.find(
                    ({chatId}) => chatId === _id
                );

                const isOnline = members?.some((member) => onlineUsers.includes(_id))
                
                return (
                    <ChatItem
                        index={index}
                        newMessageAlert={newMessageAlert} 
                        isOnline={isOnline} 
                        avatar ={avatar}
                        name = {name}
                        _id = {_id}
                        key = {_id}
                        groupChat = {groupChat}
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

