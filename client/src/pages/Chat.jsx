import React, { Fragment, useRef } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { grayColor, orange } from '../constants/color';
import {IconButton, Stack} from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../dialogues/FileMenu';
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';

const user = {
  _id: "hkwhwbdci",
  name: "Anoop Kumar"
}

const Chat = () => {

  const containerRef = useRef(null);

  return (
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
        {
          Array.isArray(sampleMessage) && sampleMessage.map((i) => (
            <MessageComponent message={i} user={user} key={i._id || i.id || Math.random()}/>
          ))
        }

      </Stack>

      <form style={{
        height: "10%"
      }}>

        <Stack direction={"row"} height={"100%"} padding={"0.5rem"} alignItems={"center"}
         position={"relative"}>

          <IconButton 
            sx={{
              position: "absolute",
              left: "0.5rem",
              rotate: "25deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder='Type Message here' />

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

      <FileMenu />
      
    </Fragment>
  )
}

export default AppLayout()(Chat)
