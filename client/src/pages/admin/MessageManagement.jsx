import axios from 'axios';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
// import RenderedAttachment from "../../components/shared/RenderedAttachment";
import Table from '../../components/shared/Table';
import { server } from '../../constants/config';
import { fileFormat, transformImage } from '../../lib/features';


const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  // {
  //   field: "attachments",
  //   headerName: "Attachments",
  //   headerClassName: "table-header",
  //   width: 200,
  //   renderCell:(params) => {

  //     const {attachments} = params.row;

  //     return attachments?.length > 0 ? 
  //                           attachments.map((i) => {

  //                             const url = i.url;
  //                             const file = fileFormat(url);

  //                             return <Box>
  //                                        <a href={url}
  //                                         download
  //                                         target="_blank"
  //                                         style={{
  //                                           color: "black",
  //                                         }}
  //                                        >
  //                                           {RenderedAttachment({file, url})}
  //                                        </a>
  //                                   </Box>
  //                           }) 
  //                           : 
  //                           "No Attachments";

  //   }
  // },
  // Fix the attachments column
{
  field: "attachments",
  headerName: "Attachments",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => {
    try {
      const { attachments } = params.row;

      if (!attachments || attachments.length === 0) {
        return "No Attachments";
      }

      return attachments.map((attachment, index) => {
        try {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={attachment.public_id || index}>
              <a 
                href={url}
                download
                target="_blank"
                style={{
                  color: "black",
                  textDecoration: "underline",
                }}
              >
                {file} {/* ✅ Just show the file type, not RenderedAttachment component */}
              </a>
            </Box>
          );
        } catch (error) {
          console.error("Error rendering attachment:", attachment, error);
          return <span key={index}>File</span>;
        }
      });
    } catch (error) {
      console.error("Error in attachments renderCell:", error);
      return "Error loading attachments";
    }
  }
},
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  // {
  //   field: "sender",
  //   headerName: "Sent by",
  //   headerClassName: "table-header",
  //   width: 200,
  //   renderCell:(params) => (
  //     <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
  //       <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
  //       <span>{params.row.sender.name}</span>
  //     </Stack>
  //   )
  // },
  {
  field: "sender",
  headerName: "Sent by",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => {
    try {
      const sender = params.row.sender;
      
      if (!sender) {
        return "Unknown User";
      }

      return (
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
          <Avatar 
            alt={sender.name || "User"} 
            src={sender.avatar || ""}
            sx={{ width: 30, height: 30 }}
          />
          <span>{sender.name || "Unknown"}</span>
        </Stack>
      );
    } catch (error) {
      console.error("Error in sender renderCell:", error);
      return "Error loading sender";
    }
  }
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

  // const {loading , data , error , refetch} = useFetchData(`${server}/api/v1/admin/messages` , "dashboard-messages");

  // useErrors([{
  //       isError: error,
  //       error: error ,
  // }])

  // const [rows , setRows] = useState([]);

  // useEffect(() => {
  //   if(data){
  //     setRows(data.messages.map((i) => ({
  //       ...i,
  //       id: i._id,
  //       sender: {
  //         name: i.sender.name,
  //         avatar: transformImage(i.sender.avatar, 50)
  //       },
  //       createdAt: moment(i.createdAt).format("DD/MM/YYYY HH:mm:ss"),
  //     })))
  //   }
  // },[data])


  // ✅ Manual fetch with credentials
  const [manualData, setManualData] = useState(null);
  const [manualLoading, setManualLoading] = useState(true);
  const [manualError, setManualError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Making manual API call for messages...");
        const response = await axios.get(`${server}/api/v1/admin/messages`, {
          withCredentials: true, // ✅ Ensure cookies are sent
        });
        
        console.log("Manual API response for messages:", response.data);
        setManualData(response.data);
      } catch (error) {
        console.error("Manual API error for messages:", error);
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

  console.log("MessageManagement - loading:", loading);
  console.log("MessageManagement - data:", data);
  console.log("MessageManagement - error:", error);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && data.success && data.messages) {
      console.log("Processing messages:", data.messages);
      setRows(data.messages.map((message) => ({
        ...message,
        id: message._id,
        sender: {
          ...message.sender,
          avatar: transformImage(message.sender.avatar, 50) || "",
        },
        createdAt: moment(message.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      })));
    }
  }, [data]);


  return (
    <AdminLayout>
        {loading ? <Skeleton height={"100vh"}/> : (
          <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
        )}
    </AdminLayout>
  )
}

export default MessageManagement
