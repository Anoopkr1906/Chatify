// import { Grid } from '@mui/material'
// import React from 'react'

// const Groups = () => {
//   return (
//     <Grid container height={"100vh"}>

//       <Grid 
//         item 
//         sx={{
//           display: {
//             xs: "none",
//             sm: "block"
//           }
//         }}
//         sm={4}
//       >
//          Groups List
//       </Grid>

//       <Grid
//         item 
//         xs={12}
//         sm={8}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           position: "relative",
//           padding: "1rem 3rem"
//         }}
//       >
//         Group details
//       </Grid>

//     </Grid>
//   )
// }

// export default Groups


import { Delete as DeleteIcon , Add as AddIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon} from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, Drawer, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React , {useState , memo, useEffect, lazy, Suspense} from 'react';
import { bgGradient, lightBlue, natBlack } from '../constants/color';
import { useNavigate , useSearchParams} from 'react-router-dom';
import { Link } from '../components/styles/StyledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import UserItem from '../components/shared/UserItem';
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { LayoutLoader } from '../components/Layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';

const ConfirmDeleteDialogue = lazy(() => import('../dialogues/ConfirmDeleteDialogue'));
const AddMemberDialogue = lazy(() => import('../dialogues/AddMemberDialogue'));

const Groups = () => {

  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("group");

  const dispatch = useDispatch();

  const {isAddMember} = useSelector((state) => state.misc);

  const navigate = useNavigate();

  const myGroups = useMyGroupsQuery();

  const groupDetails = useChatDetailsQuery(
    {chatId , populate: true} , 
    { skip: !chatId}
  );

  const [updateGroup , isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);

  const [removeMember , isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);

  const [deleteGroup , isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [isMobileMenuOpen , setIsMobileMenuOpen] = useState(false);

  const [isEdit , setIsEdit] = useState(false);

  const [groupName , setGroupName] = useState("");
  const [groupNameUpdatedValue , setGroupNameUpdatedValue] = useState("");

  const [members , setMembers] = useState([]);

  const [confirmDeleteDialog , setConfirmDeleteDialog] = useState(false);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
    }
  ];

  useErrors(errors);

  useEffect(() => {

    if(groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails?.data?.chat?.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    }

  },[groupDetails.data])

  const handleMobile = () => {
    setIsMobileMenuOpen(prev => !prev)
  }
  
  const navigateBack = () => {
    navigate("/");
  }

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  }

  const updateGroupsName = () => {
    setIsEdit(false);
    updateGroup("Updating group name..." , {chatId , name: groupNameUpdatedValue})
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  }

  const openAddMemberHandler = () => {
    console.log("Open Add Member Dialog");
    dispatch(setIsAddMember(true));

  }

  const deleteHandler = () => {
    deleteGroup("Deleting group..." , chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  }

  const removeMemberHandler = (userId) => {
    console.log("Remove member with id: ", userId);
    removeMember("Removing member..." , { chatId , userId });
  }

  useEffect(() => {
    if(chatId){
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    }

  },[chatId])

  const IconBtns = 
    <>
      <Box sx={{
            display: { xs: "block", sm: "none" },
            position: "fixed",
            right: "1rem",
            top: "1.5rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">

        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: natBlack,
            color: "white",
            "&:hover": {
              bgcolor: lightBlue ,
            }
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>

      </Tooltip>
    </>

  const GroupName = 
          <>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"}
              padding={"3rem"}
            >
              {
                isEdit ?
                  <>
                    <TextField value={groupNameUpdatedValue} onChange={(e) => {
                      setGroupNameUpdatedValue(e.target.value)
                    }}/>
                    <IconButton onClick={updateGroupsName} disabled={isLoadingGroupName}>
                      <DoneIcon />
                    </IconButton>
                  </>
                  :
                  <>
                    <Typography variant="h4">{groupName}</Typography>
                    <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
                      <EditIcon />
                    </IconButton>
                  </>
              }
            </Stack>
          </>;
    
    const ButtonGroup = <>
                            <Stack
                              direction={{
                                sm: "row",
                                xs: "column-reverse",
                              }}
                              spacing={"1rem"}
                              p={{
                                xs: "0",
                                sm: "1rem",
                                md: "1rem 4rem",
                              }}
                            >
                              <Button size="large" color='error' variant="outlined" startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
                              <Button size="large" variant="contained" startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
                            </Stack>
                        </>
  
  return myGroups.isLoading? <LayoutLoader /> : (
    <div className="flex h-screen">
      {/* Sidebar: hidden on xs, 1/3 width on sm+ */}
      <div className="hidden sm:block sm:w-1/3">
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </div>

      {/* Main content: full width on xs, 2/3 width on sm+ */}
      <div className="w-full sm:w-2/3 flex flex-col items-center relative pl-3 pr-3">
        {IconBtns}

        {groupName && 
          <>
            {GroupName}

            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1" 
            >
              Members
            </Typography>

            <Stack
              maxWidth={"45rem"}
              boxSizing={"border-box"}
              spacing={"2rem"}
              alignItems={"center"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              width={"100%"}
              // bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* Members */}

              { isLoadingRemoveMember ? <CircularProgress /> :
                members.map((i) => (
                  <UserItem user={i} isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem"
                    }}
                    key={i._id}
                    handler={removeMemberHandler}
                  />
                ))
              }

            </Stack>

            {ButtonGroup}

          </>
        }
      </div>

      {
        isAddMember &&(
            <Suspense fallback={<Backdrop open/>}>
              <AddMemberDialogue chatId={chatId}/>
            </Suspense>
        )
      }

      {
        confirmDeleteDialog &&
        (
          <Suspense fallback={<Backdrop open/>}>
            <ConfirmDeleteDialogue open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        ) 
      }

      <Drawer 
        sx={{
          display: {
            xs: "block",
            sm: "none"
          },
          backgroundImage: bgGradient
        }}
        open={isMobileMenuOpen} onClose={handleMobileClose}
      >
        <GroupsList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Drawer>
    </div>
  );
};


const GroupsList = ({w="100%" , myGroups=[] , chatId}) => (

     <Stack width={w} direction={"column"} sx={{backgroundImage: bgGradient , height: "100vh"}} overflow={"auto"}>
        {
          myGroups.length > 0 ? (myGroups.map((group) => {
            return <GroupListItem group={group} chatId={chatId} key={group._id}/>
          })) :
          (
            <Typography textAlign={"center"} padding="1rem">
              No Groups
            </Typography>
          )
        }
     </Stack>
)


const GroupListItem = memo(({group , chatId}) => {

  const {name , avatar , _id} = group ;

  return ( 
          <Link to={`?group=${_id}`} 
            onClick={(e) => {
              if(chatId === _id){
                e.preventDefault()
              }
            }}
          >
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} padding={"0.5rem 1rem"}>
              <AvatarCard avatar={avatar}/>
              <Typography>{name}</Typography>
            </Stack>
          </Link>
        )

})

export default Groups;
