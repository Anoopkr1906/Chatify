import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'

function ChatItem({
    avatar=[],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index,
    handleDeleteChatOpen,
}) 
{
  return (
    <Link sx={{padding: "0"}} to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChatOpen(e , _id , groupChat)}>

        <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            padding: "1rem",
            backgroundColor: sameSender ? "black" : "unset",
            color: sameSender ? "white" : "unset",
            position: "relative",
        }}>

            {/* Avatar Card*/}


            <Stack>
                <Typography>
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

        </div>

    </Link>
  )
}

export default memo(ChatItem)
