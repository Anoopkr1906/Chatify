import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { grayColor, orange } from '../constants/color';
import {IconButton, Skeleton, Stack} from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../dialogues/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../Socket';
import { NEW_MESSAGE } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvent } from '../hooks/hook';
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';



const Chat = ({chatId , user}) => {

  const containerRef = useRef(null);

  const socket = getSocket();

  const dispatch = useDispatch();

  const [message , setMessage] = useState("");

  const [messages , setMessages] = useState([]);

  const [page , setPage] = useState(1);

  const [fileMenuAnchor , setFileMenuAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({chatId , skip: !chatId});

  const oldMessagesChunk = useGetMessagesQuery({chatId , page});

  const {data: oldMessages , setData: setOldMessages} = useInfiniteScrollTop(containerRef , oldMessagesChunk.data?.totalPages , page , setPage , oldMessagesChunk.data?.messages);

  const errors = [
                  {isError: chatDetails.isError , error: chatDetails.error},
                  {isError: oldMessagesChunk.isError , error: oldMessagesChunk.error},
                ];

  const members = chatDetails?.data?.chat?.members ;

  console.log(messages);

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const submitHandler = (e) => {
    e.preventDefault();

    if(!message.trim()) return ;

    socket.emit(NEW_MESSAGE , {chatId , members , message});
    setMessage("");

    // emitting msg to the server
    console.log(message);
  };

  const newMsgHandler = useCallback((data) => {

    setMessages((prev) => [...prev , data.message]);

  },[]);

  const eventHandlers = {[NEW_MESSAGE]: newMsgHandler};

  useSocketEvent(socket , eventHandlers);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  // const allMessages = [...oldMessagesChunk.data.messages , ...messages];


  return chatDetails.isLoading ? (<Skeleton />) :
   (
    <Fragment>
      <Stack ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        
        {/* Messages Render */}
        {/* {!oldMessagesChunk.isLoading && oldMessagesChunk.data?.messages?.map((i) => (
            <MessageComponent message={i} user={user} key={i._id}/>
        ))} */}
        {allMessages.map((i) => (
            <MessageComponent message={i} user={user} key={i._id}/>
        ))}
        

      </Stack>

      <form style={{
        height: "10%"
        }}
        onSubmit={submitHandler}
      >

        <Stack direction={"row"} height={"100%"} padding={"0.5rem"} alignItems={"center"}
         position={"relative"}>

          <IconButton 
            sx={{
              position: "absolute",
              left: "0.5rem",
              rotate: "25deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder='Type Message here' value={message} onChange={e => setMessage(e.target.value)}/>

          <IconButton 
            type="submit" 
            sx = {{
              rotate: "-25deg",
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover" :{
                backgroundColor: "error.dark"
              }
          }}>
            <SendIcon />
          </IconButton>
        </Stack>

      </form>

      <FileMenu anchorE1={fileMenuAnchor}/>
      
    </Fragment>
  )
}

export default AppLayout()(Chat)
