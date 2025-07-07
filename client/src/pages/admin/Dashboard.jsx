import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import moment from 'moment'
import AdminLayout from '../../components/Layout/AdminLayout'
import { CurveButton, SearchField } from '../../components/styles/StyledComponents'
import { DoughnutChart, LineChart } from '../../specific/Charts'

import { useFetchData } from '6pp'
import { LayoutLoader } from '../../components/Layout/Loaders'
import { server } from '../../constants/config'
import { useErrors } from '../../hooks/hook'



const Dashboard = () => {

    const {loading , data , error , refetch} = useFetchData(`${server}/api/v1/admin/stats` , "dashboard-stats");

    const {stats} = data || {};

    useErrors([{
        isError: error,
        error: error ,
    }])

    const AppBar = 
                <Paper 
                    elevation={3}
                    sx={{
                        padding: "2rem",
                        margin: "2rem 0",
                        borderRadius: "1rem",
                    }}
                >
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <AdminPanelSettingsIcon sx={{fontSize: "3rem"}}/>
                        <SearchField />
                        <CurveButton>
                            Search
                        </CurveButton>

                        <Box flexGrow={1}/>

                        <Typography 
                            display={{
                                xs: "none",
                                lg: "block"
                            }}
                        >
                            {moment().format("dddd, D MMMM YYYY")}
                        </Typography>

                        <NotificationsIcon />
                    </Stack>
                </Paper>

        const Widgets = <Stack direction={{
                            xs: "column",
                            sm: "row"
                        }}
                            spacing={"2rem"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            margin={"2rem 0"}
                        >
                            <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />}/>
                            <Widget title={"Chats"} value={stats?.totalChatsCount} Icon={<GroupIcon />}/>
                            <Widget title={"Messages"} value={stats?.messagesCount} Icon={<MessageIcon />}/>
                        </Stack>

  return loading ? <LayoutLoader /> : (
    <AdminLayout>
        <Container component={"main"}>

            {AppBar}

            <Stack 
                direction={{xs: "column" , lg: "row"}} 
                sx={{gap: "2rem"}} 
                flexWrap={"wrap"} 
                justifyContent={"center"}
                alignItems={{
                    xs: "center",
                    lg: "stretch",
                }}
            >
                <Paper elevation={3}
                    sx={{
                        padding: "2rem 3.5rem",
                        borderRadius: "1rem",
                        width: "100%",
                        maxWidth: "32rem",
                    }}
                >
                    <Typography margin={"2rem 0"} variant="h4">
                        Last Messages
                    </Typography>

                    <LineChart value={stats?.messagesChart || []}/>

                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        padding: "1rem",
                        borderRadius: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: { xs: "100%" , sm: "50%"},
                        position: "relative",
                        width: "100%",
                        maxWidth: "22rem",
                    }}
                >
                    <DoughnutChart labels={["Single Chats" , "Group chats"]} value={[ stats?.totalChatsCount - stats?.groupsCount || 0 , stats?.groupsCount || 0]}/>

                    <Stack 
                        position={"absolute"}
                        direction={"row"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        spacing={"0.5rem"}
                        width={"100%"}
                        height={"100%"}
                    >
                        <GroupIcon />
                        <Typography>Vs</Typography>
                        <PersonIcon />
                    </Stack>
                </Paper>
            </Stack>

            { Widgets }

        </Container>
    </AdminLayout>
  );
}

const Widget = ({title ,value , Icon}) => {
    return (
        <Paper elevation={3} 
            sx={{
                padding: "2rem",
                margin: "2rem 0",
                borderRadius: "1rem",
                width: "20rem"
            }}
        >
            <Typography
                sx={{
                    color: "rgba(0,0,0,0.7)",
                    borderRadius: "50%",
                    border: "5px solid rgba(0,0,0,0.9)",
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "1rem"
                }}
            >
                {value}
            </Typography>
            <Stack
                direction={"row"} spacing={"1.5rem"} alignItems={"center"}
            >
                {Icon}
                <Typography>{title}</Typography>
            </Stack>
        </Paper>
    )
}

export default Dashboard
