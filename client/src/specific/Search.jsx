import React, { useState , useEffect} from 'react'
import {Dialog, DialogTitle, Input, InputAdornment, List, ListItem, ListItemText, Stack, TextField} from '@mui/material'
import {useInputValidation} from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../components/shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../redux/api/api';
import toast from 'react-hot-toast';
import { useAsyncMutation } from '../hooks/hook';
import axios from 'axios';
import { server } from '../constants/config'; // ✅ Ensure this matches your backend port


const Search = () => {

  const {isSearch} = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();

  // const [sendFriendRequest , isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

  const [isLoadingSendFriendRequest, setIsLoadingSendFriendRequest] = useState(false);

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users , setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    // console.log(id);

    // await sendFriendRequest("Sending Friend req..." , {userId: id});

    try {
            console.log("Sending friend request to ID:", id);
            setIsLoadingSendFriendRequest(true);

            const response = await axios.put(
                `${server}/api/v1/user/sendRequest`,
                { userId: id },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            console.log("Friend request response:", response.data);
            toast.success(response.data.message || "Friend request sent successfully");

        } catch (error) {
            console.error("Friend request error:", error);
            
            if (error.response) {
                console.error("Error response:", error.response.data);
                toast.error(error.response.data.message || "Failed to send friend request");
            } else {
                toast.error("Network error occurred");
            }
        } finally {
            setIsLoadingSendFriendRequest(false);
        }
  }

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {

    // debouncing concept
    // log search.value after a time interval
    const timeoutId = setTimeout(() => {
      searchUser(search.value).then(({data}) => {
        setUsers(data.users);
      })
      .catch((err) => console.log(err));
    },1000)

    return () => {
      clearTimeout(timeoutId);
    }

  }, [search.value])
  

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}
        sx={{background: "linear-gradient(135deg, #f8fafc 0%, #a5b4fc 100%)"}}
      >

        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
        />

        <List>
          {
            users.map((i) => (
              <UserItem 
                user={i} 
                key={i._id} 
                handler={addFriendHandler} 
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          }
        </List>

      </Stack>
    </Dialog>
  )
}

export default Search
