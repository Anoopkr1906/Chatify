import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../constants/sampleData'
import { Avatar, ListItem } from '@mui/material';

function Notifications() {

  const friendRequestHandler = ({id , accept}) => {
    console.log(id, accept);
  }


  return (
    <Dialog open>

      <Stack p={{xs: "1rem" , sm: "2rem"}} maxWidth={"25rem"}>

        <DialogTitle>
          Notifications 
        </DialogTitle>


        {
          sampleNotifications.length > 0 ? 
            (<>
              {sampleNotifications.map((i) => (
                <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>
              ))}
            </>)
            :
            (<Typography textAlign={"center"}>No Notifications</Typography>)
        }

      </Stack>

    </Dialog>
  )
}

export default Notifications


const NotificationItem = memo(({ sender , _id , handler }) => {

  const { name, avatar } = sender;


  return (
    <>
      <ListItem >
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}
            
          >
              <Avatar />

              <Typography
                  variant="body1"
                  // sx={{
                  //     flexGrow: 1,
                  //     display: "-webkit-box",
                  //     WebKitLineClamp: 1,
                  //     WebkitBoxOrient: "vertical",
                  //     overflow: "hidden",
                  //     textOverflow: "ellipsis",
                  //     width: "100%",
                  // }}
                  noWrap
                  sx={{
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
              >
                  {`${name} sent you a friend request`}
              </Typography>

              <Stack direction={{
                xs: "column",
                sm: "row"
              }}>
                <Button onClick={() => handler({_id , accept: true})}>
                  Accept
                </Button>
                <Button color="error" onClick={() => handler({_id , accept: false})}>
                  Reject
                </Button>
              </Stack>
          </Stack>
          
      </ListItem>
    </>
  )
})
