// import { Grid , Skeleton} from "@mui/material"
// import React from "react"

// export const LayoutLoader = () => {
//     return (
//             <Grid
//                 container
//                 height="calc(100vh - 4rem)"
//                 spacing={"1rem"}
//             >
//                 <Grid item sm={4} md={3} height="100%" 
//                    sx={{
//                     display:{xs: "none" , sm: "block"}, // Hides on small screens
//                    }}>
//                     <Skeleton variant="rectangular" height="100vh"/>
//                 </Grid>

//                 <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
//                     {
//                         Array.from({length: 10}).map((_ , index) => {
//                             <Skeleton variant="rectangular" height={"10rem"}/>
//                         })
//                     }
//                 </Grid>

//                 <Grid item md={4} lg={3} height="100%"
//                     sx={{display: {xs: "none", md: "block"}, bgcolor: "rgba(0, 0, 0, 0.85)" 
//                     }}>
//                     <Skeleton variant="rectangular" height="100vh"/>
//                 </Grid>

//             </Grid>
//     )
// }




import { Stack } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponents";

export const LayoutLoader = () => {
  return (
    <div className="flex w-full h-100vh gap-4 px-2">
      {/* Left Sidebar: hidden on xs, visible on sm and up */}
      <div className="hidden sm:block sm:w-1/6 md:w-1/4 h-full">
        <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Center Content */}
      <div className="flex-1 h-full flex flex-col gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-40 bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>

      {/* Right Sidebar: hidden on xs and sm, visible on md and up */}
      <div className="hidden md:block md:w-1/4 lg:w-1/4 h-full">
        <div className="w-full h-full bg-gray-800 bg-opacity-85 animate-pulse rounded" />
      </div>
    </div>
  );
};


const TypingLoader = () => {
  return (
          <Stack
            spacing={"0.5rem"}
            direction={"row"}
            padding={"0.5rem"}
            justifyContent={"center"}
          >

            <BouncingSkeleton variant="circular" width={15} height={15}
              style={{
                animationDelay: "0.1s",
              }}
            />
            <BouncingSkeleton variant="circular" width={15} height={15}
              style={{
                animationDelay: "0.2s",
              }}
            />
            <BouncingSkeleton variant="circular" width={15} height={15}
              style={{
                animationDelay: "0.4s",
              }}
            />
            <BouncingSkeleton variant="circular" width={15} height={15}
              style={{
                animationDelay: "0.6s",
              }}
            />

          </Stack>
          )
}

export {TypingLoader};