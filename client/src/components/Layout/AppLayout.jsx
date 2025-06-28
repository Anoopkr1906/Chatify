// import React from 'react'
// import Header from './Header'
// import { Grid } from '@mui/material'

// const AppLayout = () => (WrappedComponent) => {
//   return (props) => {
//     return (
//         <>
//             <Header />
//             <Grid
//                 container
//                 height="calc(100vh - 4rem)"
//                 sx={{
//                   width: "100vw",           // Ensures grid takes full viewport width
//                   margin: 0,                // Removes default margin
//                   maxWidth: "100vw",        // Prevents overflow
//                   flexWrap: "nowrap"        // Prevents items from wrapping
//                 }}
//             >
//                 <Grid item xs={4} md={3} height="100%" 
//                    sx={{
//                     display:{xs: "none" , sm: "block"}, // Hides on small screens
//                    }}>
//                     First
//                 </Grid>
//                 <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
//                     <WrappedComponent {...props}/>
//                 </Grid>
//                 <Grid item xs={4} md={4} lg={3} height="100%"
//                     sx={{display: {xs: "none", md: "block"},
//                     padding: "2rem",
//                     bgcolor: "rgba(0, 0, 0, 0.85)"}}>
//                     Third
//                 </Grid>
//             </Grid>
//         </>
//     )
//   }
// }

// export default AppLayout



import React from "react";
import Header from "./Header";
import ChatList from "../../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const params = useParams();
    const chatId = params.chatId ;

    const handleDeleteChat = (e , _id , groupChat) => {
      e.preventDefault();
      console.log("Delete chat clicked", _id, groupChat);
    }

    return (
      <>
        <Header />
        <div className="w-full h-[calc(100vh-4rem)] flex flex-row">

          {/* Left Sidebar: hidden on xs, visible on sm and up */}
          <div className="hidden sm:block sm:w-1/6 md:w-1/4 h-full bg-gray-100">
            <ChatList chats={sampleChats} chatId={chatId} 
                // newMessagesAlert={[{
                //   chatId: chatId,
                //   count: 4,
                // },]}
                onlineUsers={["1" , "2"]}
                handleDeleteChat={handleDeleteChat}
            />
          </div>

          {/* Center Content */}
          <div className="w-full sm:w-5/6 md:w-2/4 lg:w-1/2 h-full">
            <WrappedComponent {...props} />
          </div>

          {/* Right Sidebar: hidden on xs and sm, visible on md and up */}
          <div className="hidden md:block md:w-1/4 lg:w-1/4 h-full bg-black bg-opacity-85 p-4 text-white">
            <Profile />
          </div>

        </div>
      </>
    );
  };
};

export default AppLayout;
