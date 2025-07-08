import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {Face as FaceIcon , AlternateEmail as UsernameIcon , CalendarMonth as CalendarIcon} from '@mui/icons-material'

import moment from 'moment'
import { transformImage } from '../lib/features'

const Profile = ({user}) => {
  
  // Add safety checks to prevent rendering objects
  if (!user) {
    return (
      <div>
        <Stack spacing={"1rem"} direction={"column"} alignItems={"center"}>
          <Typography color="white">Loading profile...</Typography>
        </Stack>
      </div>
    );
  }

  // Ensure user properties are safe to render
  const safeUser = {
    avatar: user.avatar || { url: '' },
    bio: typeof user.bio === 'string' ? user.bio : '',
    username: typeof user.username === 'string' ? user.username : '',
    name: typeof user.name === 'string' ? user.name : '',
    createdAt: user.createdAt || new Date()
  };

  return (
    <div>
      <Stack spacing={"1rem"} direction={"column"} alignItems={"center"}>
        <Avatar 
          src={transformImage(safeUser.avatar.url)}
          sx={{
            width: 200,
            height: 200,
            objectFit: "contain",
            marginBottom: "1rem",
            border: "5px solid white"
          }}
        />

        <ProfileCard heading={"Bio"} text={safeUser.bio} />
        <ProfileCard heading={"Username"} text={safeUser.username} Icon={<UsernameIcon />}/>
        <ProfileCard heading={"Name"} text={safeUser.name} Icon={<FaceIcon />}/>
        <ProfileCard heading={"Joined"} text={moment(safeUser.createdAt).fromNow()} Icon={<CalendarIcon />}/>

      </Stack>
    </div>
  )
}


const ProfileCard = ({text , Icon , heading}) => {
  // Ensure text is safe to render
  const safeText = typeof text === 'string' ? text : 
                   typeof text === 'number' ? String(text) : 
                   text ? JSON.stringify(text) : '';
  
  const safeHeading = typeof heading === 'string' ? heading : '';

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
      
    >

      {
        Icon && Icon 
      }

      <Stack>
        <Typography variant="body1">{safeText}</Typography>
        <Typography color={"gray"} variant="caption">{safeHeading}</Typography>
      </Stack>

    </Stack>
  );
};


export default Profile
