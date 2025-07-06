import React , {useState} from 'react'
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../components/shared/UserItem';
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { setIsNewGroup } from '../redux/reducers/misc';

const NewGroup = () => {

  const {isNewGroup} = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const {isError , isLoading , error , data} = useAvailableFriendsQuery();

  const [newGroup , isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

  const errors = [{
    isError,
    error,
  }]

  useErrors(errors);
  
  const groupName = useInputValidation("");

  const [selectedMembers , setSelectedMembers] = useState([]);


  const selectMemberHandler = (id) => {

    setSelectedMembers((prev) => prev.includes(id) ? prev.filter(i => i !== id ) : [...prev , id]);
  };

  const submitHandler = () => {
    if(!groupName.value) return toast.error("Group name is required");

    if(selectedMembers < 2) return toast.error("Please select atleast 3 members");

    // creating groups
    newGroup("Creating new Group..." ,{name: groupName.value , members: selectedMembers})
      .then(() => {
        toast.success("Group created successfully");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      });

    closeHandler();
  };

  const closeHandler = () => {

    dispatch(setIsNewGroup(false));

  }

  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
    
          <Stack p={{xs: "1rem" , sm: "3rem"}} width={"25rem"} spacing={"2rem"} 
            sx={{background: "linear-gradient(135deg, #f8fafc 0%, #a5b4fc 100%)"}}
          >
    
            <DialogTitle textAlign={"center"} variant="h4">
              New Group 
            </DialogTitle>

            <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>

            <Typography variant="body1">
              Members
            </Typography>

            <Stack >
                      {isLoading ? (<Skeleton />) :
                        (data?.friends?.map((i) => (
                          <UserItem 
                            user={i} 
                            key={i._id} 
                            handler={selectMemberHandler} 
                            isAdded={selectedMembers.includes(i._id)}
                          />
                        )))
                      }
            </Stack>

            <Stack direction={"row"} justifyContent={"space-evenly"}>

              <Button variant="outlined" color="error" size="large" onClick={closeHandler}>
                    Cancel
              </Button>
              <Button variant="contained" size="large" onClick={submitHandler} disabled={isLoadingNewGroup} >
                    Create
              </Button>

            </Stack>
    
          </Stack>   
    
        </Dialog>
  )
}

export default NewGroup
