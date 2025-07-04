import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React , {Suspense, useState , lazy} from 'react'
import { orange } from '../../constants/color'
import {Menu as MenuIcon , Search as SearchIcon , Add as AddIcon , Group as GroupIcon , Logout as LogoutIcon , Notifications as NotificationsIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsSearch } from '../../redux/reducers/misc'

const SearchDialogue = lazy(() => import('../../specific/Search'));
const NotificationDialogue = lazy(() => import('../../specific/Notifications'));
const NewGroupDialogue = lazy(() => import('../../specific/NewGroup'));

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isSearch} = useSelector((state) => state.misc)

    const [isNewGroup , setIsNewGroup] = useState(false);
    const [isNotification , setIsNotification] = useState(false);

    const handleMobile = () => {
        dispatch(setIsMobile(true));
    }
    const openSearch = () => {
        dispatch(setIsSearch(true));  
    }
    const openNewGroup = () => {
        setIsNewGroup((prev) => !prev);
    }
    const openNotification = () => {
        setIsNotification((prev) => !prev);
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
                        
                        <Tooltip title="Search">
                            <IconButton color='inherit' size="large" onClick={openSearch}>
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>


                        <Tooltip title="New Group">
                            <IconButton color='inherit' size="large" onClick={openNewGroup}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Manage Groups">
                            <IconButton color='inherit' size="large" onClick={navigateToGroups}>
                                <GroupIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Notifications">
                            <IconButton color='inherit' size="large" onClick={openNotification}>
                                <NotificationsIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Logout">
                            <IconButton color='inherit' size="large" onClick={handleLogout}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>

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
