// import React from 'react'
// import { AvatarGroup, Stack , Box } from '@mui/material'

// // TODO Transform 

// function AvatarCard({avatar = [] , max = 4}) {
//   return (
//     <Stack direction={"row"} spacing={0.5}>
//       <AvatarGroup max={max}>
//         <Box width={"5rem"} height={"3rem"}>
//           {
//             avatar.map((i , index) => (
//               <img 
//                 key={Math.random()*100}
//                 src={i} 
//                 alt={`Avatar ${index }`} 
//                 sx={{ width: 32, height: 32, position:"absolute", left:{
//                   xs: `${index + 0.5}rem`,
//                   sm: `${index}rem`,
//                 }}}
//               />
//             ))
//           }
//         </Box>
//       </AvatarGroup>
//     </Stack>  
//   )
// }

// export default AvatarCard



import React from 'react'
import { AvatarGroup, Stack, Avatar, Box } from '@mui/material'
import { transformImage } from '../../lib/features'

function AvatarCard({ avatar = [], max = 4 }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{flexShrink:0 , display: "flex", alignItems: "center" , overflow: "visible"}}>
        <AvatarGroup max={max}
            sx={{
              '& .MuiAvatar-root': {
                marginLeft: '-24px', // more negative = more overlap
                border: '2px solid white', // optional: adds a border for separation
              },
              position: "relative",
            }}
          >
          {avatar.map((src, index) => (
            <Avatar
              key={index}
              src={transformImage(src)}
              alt={`Avatar ${index}`}
              sx={{ width: 32, height: 32}}
            />
          ))}
        </AvatarGroup>
      </Box>
    </Stack>
  )
}

export default AvatarCard
