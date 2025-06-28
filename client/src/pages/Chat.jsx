import React, { Fragment, useRef } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { grayColor, orange } from '../constants/color';
import {IconButton, Stack} from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';

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
      
    </Fragment>
  )
}

export default AppLayout()(Chat)
