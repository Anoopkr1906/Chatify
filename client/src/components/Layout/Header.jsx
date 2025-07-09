import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React , {Suspense , lazy} from 'react'
import { blueGray } from '../../constants/color'
import {Menu as MenuIcon , AdminPanelSettings as AdminIcon  , Search as SearchIcon , Add as AddIcon , Group as GroupIcon , Logout as LogoutIcon , Notifications as NotificationsIcon, GitHub, LinkedIn} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotificationCount } from '../../redux/reducers/chat'
import ThemeToggle from '../shared/ThemeToggle'


const SearchDialogue = lazy(() => import('../../specific/Search'));
const NotificationDialogue = lazy(() => import('../../specific/Notifications'));
const NewGroupDialogue = lazy(() => import('../../specific/NewGroup'));

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const linkedinUrl = "https://www.linkedin.com/in/anoop-kumar-burnwal-aa0b10318/"; // Replace with your LinkedIn URL
    const githubUrl = "https://github.com/Anoopkr1906"; // Replace with your GitHub URL

    const {isSearch , isNotification , isNewGroup} = useSelector((state) => state.misc)
    const {notificationCount} = useSelector((state) => state.chat)

    const openLinkedIn = () => {
        window.open(linkedinUrl, '_blank');
    }

    const openGitHub = () => {
        window.open(githubUrl, '_blank');
    }

    const handleMobile = () => {
        dispatch(setIsMobile(true));
    }
    const openSearch = () => {
        dispatch(setIsSearch(true));  
    }
    const openNewGroup = () => {
        dispatch(setIsNewGroup(true));
    }
    const openNotification = () => {
        console.log("Opening notifications"); // ✅ Debug log
        dispatch(setIsNotification(true));
        dispatch(resetNotificationCount());
    }
    const navigateToGroups = () => {
        navigate("/groups")
    }

    const openAdminPanel = () => {
        navigate("/admin")
    }


    const handleLogout = async() => {
        console.log("Logout clicked");
        try {
            const {data} = await axios.get(`${server}/api/v1/user/logout` , {withCredentials: true});
            toast.success(data.message);
            dispatch(userNotExists());

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }

    }

  return (
    <>
        <Box sx={{flexGrow: 1}} height={"4rem"}>
            <AppBar position='static' sx={{bgcolor: blueGray}}>
                <Toolbar>

                    {/* <Typography variant='h6' sx={{
                        display: {xs: "none" , sm: "block"},
                    }}>
                        Chattify
                    </Typography> */}

                    <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1 
                        }}>
                            <Typography variant='h6' sx={{
                                display: {xs: "none" , sm: "block"},
                                marginRight: 1
                            }}>
                                Chattify
                            </Typography>

                            {/* Social Media Icons */}
                            <Box sx={{ 
                                display: {xs: "none" , sm: "flex"}, 
                                gap: 0.5 
                            }}>
                                <Tooltip title="Visit my LinkedIn">
                                    <IconButton 
                                        color="inherit" 
                                        size="small"
                                        onClick={openLinkedIn}
                                        sx={{ 
                                            '&:hover': { 
                                                color: '#0077b5' // LinkedIn blue on hover
                                            } 
                                        }}
                                    >
                                        <LinkedIn fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Visit my GitHub">
                                    <IconButton 
                                        color="inherit" 
                                        size="small"
                                        onClick={openGitHub}
                                        sx={{ 
                                            '&:hover': { 
                                                color: '#6e5494' // GitHub purple on hover
                                            } 
                                        }}
                                    >
                                        <GitHub fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography>
                                Anoop Kr. Burnwal
                            </Typography>
                        </Box>

                    <Box sx={{
                        display:{ xs: "block" , sm: "none"},
                        }}
                    >
                        <IconButton color='inherit' onClick={handleMobile}>

                            <MenuIcon />

                        </IconButton>

                    </Box>

                    <Box sx={{flexGrow:1}}/>

                    <Box>

                        <IconBtn 
                            title={"Search"}
                            icon={<SearchIcon />}
                            onClick={openSearch}
                        />
                        <IconBtn 
                            title={"New Group"}
                            icon={<AddIcon />}
                            onClick={openNewGroup}
                        />
                        <IconBtn 
                            title={"Manage Groups"}
                            icon={<GroupIcon />}
                            onClick={navigateToGroups}
                        />
                        <IconBtn 
                            title={"Notifications"}
                            icon={<NotificationsIcon />}
                            onClick={openNotification}
                            value={notificationCount}
                        />

                        <IconBtn 
                            title={"Admin Panel"}
                            icon={<AdminIcon />}
                            onClick={openAdminPanel}
                            
                        />

                        <ThemeToggle />

                        <IconBtn 
                            title={"Logout"}
                            icon={<LogoutIcon />}
                            onClick={handleLogout}
                        />

                    </Box>
                </Toolbar>
            </AppBar>
        </Box>

        {
            isSearch && (
                <Suspense fallback={ <Backdrop open/>}>
                    <SearchDialogue />
                </Suspense>
            )
        }

        {
            isNewGroup && (
                <Suspense fallback={ <Backdrop open/>}>
                    <NewGroupDialogue />
                </Suspense>
            )
        }
        
        {
            isNotification && (
                <Suspense fallback={ <Backdrop open/>}>
                    <NotificationDialogue />
                </Suspense>
            )
        }
    </>
  )
}

export default Header



const IconBtn = ({title , icon , onClick , value}) => {
    return (
        <Tooltip title={title}>
            <IconButton color="inherit" size="large" onClick={onClick}>
                {value && value > 0 ? (<Badge badgeContent={value} color="error">{icon}</Badge>) : icon}
            </IconButton>
        </Tooltip>
    )
}