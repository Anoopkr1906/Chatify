import { Menu, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../redux/reducers/misc';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAsyncMutation } from '../hooks/hook';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../redux/api/api';
import { useEffect } from 'react';

const DeleteChatMenu = ({dispatch , deleteMenuAnchor}) => {

    const navigate = useNavigate() ;

    const {isDeleteMenu , selectedDeleteChat} = useSelector((state) => state.misc);

    const [deleteChat , _ , deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup , __ , leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;;
    }

    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group..." , selectedDeleteChat.chatId);
    }

    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting chat..." , selectedDeleteChat.chatId);
    }

    useEffect(() => {
        if(deleteChatData){
            navigate("/");
        }
        if(leaveGroupData){
            navigate("/");
        }
    },[deleteChatData , leaveGroupData]);

  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor} 
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "center",
            horizontal: "center",
        }}
    >
        <Stack
            sx={{
                width: "10rem",
                padding: "0.3rem",
                cursor: "pointer",
            }}
            direction={"row"}
            alignItems={"center"}
            spacing={"0.5rem"}
            onClick={selectedDeleteChat.groupChat? leaveGroupHandler : deleteChatHandler}
        >

            {
                selectedDeleteChat.groupChat? (<><ExitToAppIcon /> <Typography>Leave Group</Typography></>) : (<><DeleteIcon /> <Typography>Delete Chat</Typography></>)
            }

        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu
