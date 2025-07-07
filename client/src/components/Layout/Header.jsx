import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React , {Suspense , lazy} from 'react'
import { orange } from '../../constants/color'
import {Menu as MenuIcon , Search as SearchIcon , Add as AddIcon , Group as GroupIcon , Logout as LogoutIcon , Notifications as NotificationsIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotificationCount } from '../../redux/reducers/chat'

const SearchDialogue = lazy(() => import('../../specific/Search'));
const NotificationDialogue = lazy(() => import('../../specific/Notifications'));
const NewGroupDialogue = lazy(() => import('../../specific/NewGroup'));

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isSearch , isNotification , isNewGroup} = useSelector((state) => state.misc)
    const {notificationCount} = useSelector((state) => state.chat)

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
        dispatch(setIsNotification(true));
        dispatch(resetNotificationCount());

    }
    const navigateToGroups = () => {
        navigate("/groups")
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
            <AppBar position='static' sx={{bgcolor: orange}}>
                <Toolbar>

                    <Typography variant='h6' sx={{
                        display: {xs: "none" , sm: "block"},
                    }}>
                        Chattify
                    </Typography>

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