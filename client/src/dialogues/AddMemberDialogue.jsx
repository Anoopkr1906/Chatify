import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData'
import UserItem from '../components/shared/UserItem'

function AddMemberDialogue({addMember , isLoadingAddMember , chatId}) {

    const [members , setMembers] = useState(sampleUsers);
    const [selectedMembers , setSelectedMembers] = useState([]);
    
    
    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter(i => i !== id ) : [...prev , id]);
    };


    const addMemberSubmitHandler = () => {
        closeHandler();
    }

    const closeHandler = () => {
        setMembers([]);
        setSelectedMembers([]);
    }

  return (
    <Dialog open onClose={closeHandler}>

        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>
                Add Member
            </DialogTitle>

            <Stack spacing={"1rem"}>
                { members.length > 0 ? (
                    members.map((user) => (
                        <UserItem key={user._id} user={user} handler={selectMemberHandler}
                            isAdded={selectedMembers.includes(user._id)}
                        />
                    ))
                    ) : (
                        <Typography textAlign={"center"}>No friends</Typography>
                    )
                }
            </Stack>

            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                <Button color="error" variant="outlined" onClick={closeHandler}>
                    Cancel
                </Button>
                <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMember}>
                    Submit Changes
                </Button>
            </Stack>

        </Stack>

    </Dialog>
  )
}

export default AddMemberDialogue
