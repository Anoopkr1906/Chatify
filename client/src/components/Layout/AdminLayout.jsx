import { Close as CloseIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon} from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useLocation , Link as LinkComponent, Navigate} from 'react-router-dom';
import { bgGradient, natBlack } from '../../constants/color';
import { styled } from '@mui/material/styles';

const Link = styled(LinkComponent)`
    text-decoration: none;
    color: black;
    border-radius: 2rem;
    padding: 1rem 2rem;
    &:hover{
    color: rgba(0 , 0 , 0 , 0.54);
    }
`


const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />
    },
    {
        name: "Users",
        path: "/admin/user-management",
        icon: <ManageAccountsIcon />
    },
    {
        name: "Chats",
        path: "/admin/chat-management",
        icon: <GroupsIcon />
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />
    },
]

const Sidebar = ({w = "100%"}) => {

    const location = useLocation();

    const logoutHandler = () => {
        console.log("logout");
    }

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"} sx={{backgroundImage: bgGradient, height: "100vh"}}>

            <Typography variant="h5" textTransform={"uppercase"}>Anoop</Typography>

            <Stack spacing={"1rem"}>
                {
                    adminTabs.map((tab) => (
                        
                            <Link key={tab.path} to={tab.path}
                                sx={
                                    location.pathname === tab.path && {
                                        bgcolor: natBlack,
                                        color: "white",
                                        ":hover":{
                                            color: "white",
                                        }
                                    }
                                }
                            >
                                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                                    {tab.icon}
                                    <Typography>
                                        {tab.name}
                                    </Typography>
                                </Stack>

                            </Link>
                        
                    ))}

                    <Link onClick={logoutHandler}>
                        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                            <ExitToAppIcon />
                            <Typography>Logout</Typography>
                        </Stack>
                    </Link>
            </Stack>

        </Stack>
    )
}

const isAdmin = true ;

const AdminLayout = ({ children }) => {

    const [isMobile , setIsMobile] = useState(false);

    const handleMobile = () => {
        setIsMobile(!isMobile);
    }

    const handleClose = () => {
        setIsMobile(false);
    }

    if(!isAdmin){
        return <Navigate to="/admin"/>
    }

  return (
    <div className="flex min-h-screen">
        <Box
            sx={{
                display: { xs: 'block', md: 'none' }, // Hide on xs, show on md and up
                position: "fixed",
                right: "1rem",
                top: "1rem",
            }} 
        >

            <IconButton onClick={handleMobile}>
                {
                    isMobile ? <CloseIcon /> : <MenuIcon />
                }
            </IconButton>

        </Box>
      {/* Sidebar: hidden on xs, visible on md and up */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4">
            <Sidebar />
        </div>
        {/* Main content: full width on xs, 2/3 on md, 3/4 on lg, with light background */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-[#f5f5f5]">
            {children}
        </div>

        <Drawer open={isMobile} onClose={handleClose}>
                <Sidebar w="50vw"/>
        </Drawer>

    </div>
  );
};

export default AdminLayout
