import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleUsers } from '../constants/sampleData'
import UserItem from '../components/shared/UserItem'

function AddMemberDialogue({addMember , isLoadingAddMember , chatId}) {

    const addFriendHandler = (id) => {
        addMember(id, chatId);
    }

    const addMemberSubmitHandler = () => {

    }

    const closeHandler = () => {

    }

  return (
    <Dialog open onClose={closeHandler}>

        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>
                Add Member
            </DialogTitle>

            <Stack spacing={"1rem"}>
                { sampleUsers.length > 0 ? (
                    sampleUsers.map((user) => (
                        <UserItem key={user._id} user={user} handler={addFriendHandler}/>
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
