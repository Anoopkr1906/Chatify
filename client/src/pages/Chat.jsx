import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { grayColor, orange } from '../constants/color';
import {IconButton, Skeleton, Stack} from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../dialogues/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../Socket';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvent } from '../hooks/hook';
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/Layout/Loaders';
import { useNavigate } from 'react-router-dom';



const Chat = ({chatId , user}) => {

  const navigate = useNavigate();

  const containerRef = useRef(null);

  const bottomRef = useRef(null);

  const socket = getSocket();

  const dispatch = useDispatch();

  const [message , setMessage] = useState("");

  const [messages , setMessages] = useState([]);

  const [page , setPage] = useState(1);

  const [fileMenuAnchor , setFileMenuAnchor] = useState(null);

  const [IamTyping , setIamTyping] = useState(false);
  const [userTyping , setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({chatId , skip: !chatId});

  const oldMessagesChunk = useGetMessagesQuery({chatId , page});

  const {data: oldMessages , setData: setOldMessages} = useInfiniteScrollTop(containerRef , oldMessagesChunk.data?.totalPages , page , setPage , oldMessagesChunk.data?.messages);

  const errors = [
                  {isError: chatDetails.isError , error: chatDetails.error},
                  {isError: oldMessagesChunk.isError , error: oldMessagesChunk.error},
                ];

  const members = chatDetails?.data?.chat?.members ;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if(!IamTyping) {
      socket.emit(START_TYPING , {members , chatId});
      setIamTyping(true);
    }

    if(typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current =  setTimeout(() => {
      setIamTyping(false);
      socket.emit(STOP_TYPING , {members , chatId});
    }, [2000]);

  }

  console.log(messages);

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }



  const submitHandler = (e) => {
    e.preventDefault();

    if(!message.trim()) return ;

    console.log("Sending message" ,message);

    // added by me to create msg immediately display
    const newMessage = {
        _id: Date.now().toString(),
        content: message,
        sender: {
            _id: user._id,
            name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
    };

    // Add to local state immediately
    setMessages((prev) => [...prev, newMessage]);
    // upto here 


    socket.emit(NEW_MESSAGE , {chatId , members , message});
    setMessage("");

    // emitting msg to the server
    
  };


  useEffect(() => {

    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessage("");
      setMessages([]);
      setPage(1);
      setOldMessages([]);
    }
  },[chatId])

  useEffect(() => {
    if(bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },[messages])

  useEffect(() => {
    if(chatDetails.isError){
      return navigate("/");
    }
  },[chatDetails.isError]);

  const newMsgListener = useCallback((data) => {
    if(data.chatId !== chatId) return ;

    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return ;
    setUserTyping(true);
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return ;
    setUserTyping(false);
  }, [chatId]);

  const alertListener = useCallback((data) => {

    if(data.chatId !== chatId) return ;
    
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "hkjwbsv",
        name: "Admin"
      },
      chat: chatId,
      createdAt : new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageForAlert]);
  }, [chatId]);

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMsgListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

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
        
        {userTyping && <TypingLoader />}
        <div ref={bottomRef}/>

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

          <InputBox placeholder='Type Message here' value={message} onChange={messageOnChange}/>

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

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
      
    </Fragment>
  )
}

export default AppLayout()(Chat)
