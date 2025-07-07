import axios from 'axios';
import { Avatar, Skeleton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import AvatarCard from "../../components/shared/AvatarCard";
import Table from '../../components/shared/Table';
import { server } from '../../constants/config';
import { transformImage } from '../../lib/features';



const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell:(params) => <AvatarCard avatar={params.row.avatar}/>
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members}/>
    )
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar}/>
        <span>{params.row.creator.name}</span>
      </Stack>
    )
  },
];

const ChatManagement = () => {

  // const {loading , data , error , refetch} = useFetchData(`${server}/api/v1/admin/chats` , "dashboard-chats");

  // useErrors([{
  //       isError: error,
  //       error: error ,
  // }])


  // const [rows , setRows] = useState([]);

  // useEffect( () => {
  //   if(data){
  //     setRows(data?.chats.map((i) => ({
  //       ...i,
  //       id: i._id,
  //       avatar: i.avatar.map(i => transformImage(i , 50)),
  //       members: i.members.map((i) => transformImage(i.avatar , 50)),
  //       creator: {
  //         name: i.creator.name,
  //         avatar: transformImage(i.creator.avatar , 50)
  //       }
  //     })))
  //   }
  // },[data])

  const [manualData, setManualData] = useState(null);
  const [manualLoading, setManualLoading] = useState(true);
  const [manualError, setManualError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Making manual API call for chats...");
        const response = await axios.get(`${server}/api/v1/admin/chats`, {
          withCredentials: true, // ✅ Ensure cookies are sent
        });
        
        console.log("Manual API response for chats:", response.data);
        setManualData(response.data);
      } catch (error) {
        console.error("Manual API error for chats:", error);
        setManualError(error);
      } finally {
        setManualLoading(false);
      }
    };

    fetchData();
  }, []);

   // ✅ Use manual data
  const loading = manualLoading;
  const data = manualData;
  const error = manualError;

  console.log("ChatManagement - loading:", loading);
  console.log("ChatManagement - data:", data);
  console.log("ChatManagement - error:", error);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && data.success && data.chats) {
      console.log("Processing chats:", data.chats);
      setRows(data.chats.map((chat) => ({
        ...chat,
        id: chat._id,
        avatar: chat.avatar.map(av => transformImage(av, 50)),
        members: chat.members.map(member => ({
          ...member,
          avatar: transformImage(member.avatar, 50) || "",
        })),
        creator: {
          ...chat.creator,
          avatar: transformImage(chat.creator.avatar, 50) || "",
        },
      })));
    }
  }, [data]);

  return (
    <AdminLayout>
        {loading ? <Skeleton height={"100vh"}/> : (
          <Table heading={"All Chats"} columns={columns} rows={rows}/>
        )}
    </AdminLayout>
  )
}

export default ChatManagement