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
import { useMyChatsQuery } from "../../redux/api/api";
import { Drawer, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useErrors } from "../../hooks/hook";
import { getSocket } from "../../Socket";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const params = useParams();
    const chatId = params.chatId ;

    const socket = getSocket(); 

    const dispatch = useDispatch();
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);

    const {isLoading , data , isError , error , refetch} = useMyChatsQuery("");

    useErrors([{isError , error}]);

    const handleDeleteChat = (e , _id , groupChat) => {
      e.preventDefault();
      console.log("Delete chat clicked", _id, groupChat);
    };

    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    }

    return (
      <>
        <Header />

        {
          isLoading ? ( <Skeleton />)
           : 
           (
            <Drawer open={isMobile} onClose={handleMobileClose}>
              <ChatList 
                w="70vw"

                chats={data?.chats} 
                chatId={chatId} 
                handleDeleteChat={handleDeleteChat}
              />
            </Drawer>
           )
        }

        <div className="w-full h-[calc(100vh-4rem)] flex flex-row">

          {/* Left Sidebar: hidden on xs, visible on sm and up */}
          <div className="hidden sm:block sm:w-1/6 md:w-1/4 h-full bg-gray-100">
            {
              isLoading ? (<Skeleton />) :
              (
                <ChatList 
                  chats={data?.chats} 
                  chatId={chatId} 
                  handleDeleteChat={handleDeleteChat}
                />
              )
            }
          </div>

          {/* Center Content */}
          <div className="w-full sm:w-5/6 md:w-2/4 lg:w-1/2 h-full">
            <WrappedComponent {...props} chatId={chatId} user={user}/>
          </div>

          {/* Right Sidebar: hidden on xs and sm, visible on md and up */}
          <div className="hidden md:block md:w-1/4 lg:w-1/4 h-full bg-black bg-opacity-85 p-4 text-white">
            <Profile user={user}/>
          </div>

        </div>
      </>
    );
  };
};

export default AppLayout;
