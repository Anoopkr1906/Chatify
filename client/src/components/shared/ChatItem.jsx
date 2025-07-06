import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import {motion} from "framer-motion"

function ChatItem({
    avatar=[],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index,
    handleDeleteChat,
}) 
{
  return (
    <Link sx={{padding: "0"}} to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e , _id , groupChat)}>

        <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1}}
            style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            padding: "1rem",
            backgroundColor: sameSender ? "black" : "unset",
            color: sameSender ? "white" : "unset",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.2s",
            "&:hover": {
                backgroundColor: sameSender ? "#222" : "#f3f4f6", // darker on hover if selected, gray otherwise
            },
        }}>

            {/* Avatar Card*/}
            <Box sx={{ width: 80, flexShrink: 0, display: "flex", alignItems: "center", overflow: "hidden" }}>
                <AvatarCard avatar={avatar}/>
            </Box>

            <Stack>
                <Typography >
                    {name}
                </Typography>

                {
                    newMessageAlert && (
                        <Typography>
                            {newMessageAlert.count} New messages
                        </Typography>
                    )
                }
            </Stack>

            {
                isOnline && (
                    <Box sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius : "50%",
                        backgroundColor: "green",
                        position: "absolute",
                        top: "50%",
                        right: "1rem",
                        transform: "translate(-50%)"
                    }}/>
                )
            }

        </motion.div>

    </Link>
  )
}

export default memo(ChatItem)




