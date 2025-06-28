import React , {useState} from 'react'
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../components/shared/UserItem';
import { useInputValidation } from '6pp';

function NewGroup() {
  
  const groupName = useInputValidation("");

  const [members , setMembers] = useState(sampleUsers);
  const [selectedMembers , setSelectedMembers] = useState([]);


  const selectMemberHandler = (id) => {

    setSelectedMembers((prev) => prev.includes(id) ? prev.filter(i => i !== id ) : [...prev , id]);
  };

  const submitHandler = () => {

  };

  const closeHandler = () => {

  }

  return (
    <Dialog open onClose={closeHandler}>
    
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
                      {
                        members.map((i) => (
                          <UserItem 
                            user={i} 
                            key={i._id} 
                            handler={selectMemberHandler} 
                            isAdded={selectedMembers.includes(i._id)}
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
