import React from 'react'
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../components/shared/UserItem';
import { useInputValidation } from '6pp';

function NewGroup() {
  
  const groupName = useInputValidation("");


  const selectMemberHandler = () => {

  };

  const submitHandler = () => {

  };

  return (
    <Dialog open>
    
          <Stack p={{xs: "1rem" , sm: "3rem"}} width={"25rem"} spacing={"2rem"}>
    
            <DialogTitle textAlign={"center"} variant="h4">
              New Group 
            </DialogTitle>

            <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>

            <Typography variant="body1">
              Members
            </Typography>

            <Stack >
                      {
                        sampleUsers.map((i) => (
                          <UserItem 
                            user={i} 
                            key={i._id} 
                            handler={selectMemberHandler} 
                          />
                        ))
                      }
            </Stack>

            <Stack direction={"row"} justifyContent={"space-evenly"}>

              <Button variant="outlined" color="error" size="large">
                    Cancel
              </Button>
              <Button variant="contained" size="large" onClick={submitHandler}>
                    Create
              </Button>

            </Stack>
    
          </Stack>

          
    
        </Dialog>
  )
}

export default NewGroup
