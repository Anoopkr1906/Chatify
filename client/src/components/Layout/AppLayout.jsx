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



import React, { useCallback, useEffect } from "react";
import Header from "./Header";
import ChatList from "../../specific/ChatList";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { Drawer, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import { useErrors, useSocketEvent } from "../../hooks/hook";
import { getSocket } from "../../Socket";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from "../../constants/events";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../../dialogues/DeleteChatMenu";
import { useRef } from "react";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const params = useParams();
    const chatId = params.chatId ;

    const deleteMenuAnchor = useRef(null);

    const navigate = useNavigate();

    const socket = getSocket(); 

    const dispatch = useDispatch();
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);


    const {newMessagesAlert} = useSelector((state) => state.chat);

    const {isLoading , data , isError , error , refetch} = useMyChatsQuery("");

    useErrors([{isError , error}]);

    useEffect(() => {
      getOrSaveFromStorage({key: NEW_MESSAGE_ALERT , value: newMessagesAlert});
    },[newMessagesAlert])

    const handleDeleteChat = (e , chatId , groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({chatId , groupChat }))
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    }

    const newMessageALertListener = useCallback((data) => {
      if(data.chatId == chatId) return;
      dispatch(setNewMessagesAlert(data));
    },[chatId]);

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification())
    },[dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    },[refetch , navigate]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageALertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener ,
    };

    useSocketEvent(socket , eventHandlers);

    return (
      <>
        <Header />

        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor.current}/>

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
                newMessagesAlert={newMessagesAlert}
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
                  newMessagesAlert={newMessagesAlert}
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
