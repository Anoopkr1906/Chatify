import { Avatar, IconButton, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import React, { memo } from 'react'
import {Add as AddIcon, Remove as RemoveIcon} from '@mui/icons-material';
import { transformImage } from '../../lib/features';

const UserItem = ({user , handler , handlerIsLoading , isAdded = false , styling ={}}) => {

    const {name , _id , avatar} = user;


    // added by me 
    const getAvatarUrl = (avatar) => {
        if (!avatar) return '';
        
        // If avatar is a string URL
        if (typeof avatar === 'string') {
            return transformImage(avatar);
        }
        
        // If avatar is an object with url property
        if (avatar && typeof avatar === 'object' && avatar.url) {
            return transformImage(avatar.url);
        }
        
        // If avatar is an array, take the first one
        if (Array.isArray(avatar) && avatar.length > 0) {
            const firstAvatar = avatar[0];
            if (typeof firstAvatar === 'string') {
                return transformImage(firstAvatar);
            }
            if (firstAvatar && firstAvatar.url) {
                return transformImage(firstAvatar.url);
            }
        }
        
        return ''; // Return empty string as fallback
    };


  return (
    <ListItem >
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} {...styling}>
            <Avatar src={getAvatarUrl(avatar)}/>

            <Typography
                variant="body1"
                sx={{
                    flexGrow: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    webkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                }}
            >
                {name}
            </Typography>
            <IconButton 
                size= "small"
                sx = {{
                    bgcolor: isAdded ? "error.main" : "primary.main",
                    color: "white",
                    "&:hover": {
                        bgcolor: isAdded ? "error.dark" : "primary.dark",
                    }
                }}
                onClick={() => handler(_id)} 
                disabled={handlerIsLoading}
            >
                {
                    isAdded ? <RemoveIcon /> : <AddIcon/>
                }
            </IconButton>
        </Stack>
        
    </ListItem>
  )
}

export default memo(UserItem)
