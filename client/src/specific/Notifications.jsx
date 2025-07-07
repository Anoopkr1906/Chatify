import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api';
import { setIsNotification } from '../redux/reducers/misc';

function Notifications() {

  const dispatch = useDispatch();

  const {isNotification} = useSelector((state) => state.misc)

  const {isLoading , data , error , isError} = useGetNotificationsQuery(); 

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async({_id , accept}) => {

    dispatch(setIsNotification(false));

    await acceptRequest("Accepting..." ,{requestId: _id , accept});
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
              {data?.allRequests.length > 0 ? (
                data?.allRequests?.map(({ sender, _id }) => (
                  <NotificationItem
                    sender={sender}
                    _id={_id}
                    handler={friendRequestHandler}
                    key={_id}
                  />
                ))
              ) : (
                <Typography textAlign={"center"}>0 notifications</Typography>
              )}
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
