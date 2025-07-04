import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../constants/sampleData'
import { Avatar, ListItem } from '@mui/material';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api';
import { useErrors } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../redux/reducers/misc';
import toast from 'react-hot-toast';

function Notifications() {

  const dispatch = useDispatch();

  const {isNotification} = useSelector((state) => state.misc)

  const {isLoading , data , error , isError} = useGetNotificationsQuery(); 

  const [acceptRequest] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async ({_id , accept}) => {

    dispatch(setIsNotification(false));

    try {
      const res = await acceptRequest({requestId: _id , accept});

      if(res.data?.success){
        console.log("Use socket here");
        toast.success(res.data.message);
      }else{
        toast.error(res.data?.error || "Something went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const closeHandler = () => {
    dispatch(setIsNotification(false));
  }

  useErrors([{error , isError}]);


  return (
    <Dialog open={isNotification} onClose={closeHandler}>

      <Stack p={{xs: "1rem" , sm: "2rem"}} maxWidth={"25rem"}
        sx={{background: "linear-gradient(135deg, #f8fafc 0%, #a5b4fc 100%)"}}
      >

        <DialogTitle>
          Notifications 
        </DialogTitle>


        {
          isLoading ? <Skeleton />
          :
          (
            <>
              {
                data?.allRequests.length > 0 ? 
                  (<>
                    {data?.allRequests.map((i) => (
                      <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>
                    ))}
                  </>)
                  :
                  (<Typography textAlign={"center"}>No Notifications</Typography>)
              }
            </>
          )
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
