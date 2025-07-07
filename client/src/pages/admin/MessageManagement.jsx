import { useFetchData } from '6pp';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import RenderedAttachment from "../../components/shared/RenderedAttachment";
import Table from '../../components/shared/Table';
import { server } from '../../constants/config';
import { useErrors } from '../../hooks/hook';
import { fileFormat, transformImage } from '../../lib/features';


const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell:(params) => {

      const {attachments} = params.row;

      return attachments?.length > 0 ? 
                            attachments.map((i) => {

                              const url = i.url;
                              const file = fileFormat(url);

                              return <Box>
                                         <a href={url}
                                          download
                                          target="_blank"
                                          style={{
                                            color: "black",
                                          }}
                                         >
                                            {RenderedAttachment({file, url})}
                                         </a>
                                    </Box>
                            }) 
                            : 
                            "No Attachments";

    }
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent by",
    headerClassName: "table-header",
    width: 200,
    renderCell:(params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
        <span>{params.row.sender.name}</span>
      </Stack>
    )
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

function MessageManagement() {

  const {loading , data , error , refetch} = useFetchData(`${server}/api/v1/admin/messages` , "dashboard-messages");

  useErrors([{
        isError: error,
        error: error ,
  }])

  const [rows , setRows] = useState([]);

  useEffect(() => {
    if(data){
      setRows(data.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50)
        },
        createdAt: moment(i.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      })))
    }
  },[data])


  return (
    <AdminLayout>
        {loading ? <Skeleton height={"100vh"}/> : (
          <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
        )}
    </AdminLayout>
  )
}

export default MessageManagement
