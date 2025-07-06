import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData'
import UserItem from '../components/shared/UserItem'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';

const AddMemberDialogue = ({chatId}) => {

    const dispatch = useDispatch();

    const {isAddMember} = useSelector((state) => state.misc);

    const {isLoading , data , isError , error} = useAvailableFriendsQuery(chatId) ;

    const [addMembers , isLoadingAddMembers] = useAsyncMutation(useAddGroupMemberMutation);

    const [selectedMembers , setSelectedMembers] = useState([]);
    
    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter(i => i !== id ) : [...prev , id]);
    };


    const addMemberSubmitHandler = () => {
        addMembers("Adding members..." , {members: selectedMembers , chatId})
        closeHandler();
    }

    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    }

    useErrors([{isError , error}]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>

        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>
                Add Member
            </DialogTitle>

            <Stack spacing={"1rem"}>
                {isLoading ? <Skeleton /> : data?.friends?.length > 0 ? (
                    data?.friends?.map((user) => (
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
                <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMembers}>
                    Submit Changes
                </Button>
            </Stack>

        </Stack>

    </Dialog>
  )
}

export default AddMemberDialogue
