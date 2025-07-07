import { useFetchData } from '6pp';
import { Avatar, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import Table from '../../components/shared/Table';
import { server } from '../../constants/config';
import { useErrors } from '../../hooks/hook';
import { transformImage } from '../../lib/features';
import axios from 'axios';



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
    renderCell:(params) => <Avatar alt={params.row.name} src={params.row.avatar}/>
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 150,
  },
];

const UserManagement = () => {

  // const {loading , data , error } = useFetchData(`${server}/api/v1/admin/users` , "dashboard-users");

  // useErrors([{
  //       isError: error,
  //       error: error ,
  // }])

  // const [rows , setRows] = useState([]);

  // console.log("UserManagement data:", data); // Debug log to check data structure

  // useEffect( () => {
  //   if(data){
  //     setRows(data.users.map((i) => ({...i , id:i._id , avatar: transformImage(i.avatar , 50) || ""})))
  //   }
  // },[data])


  // ✅ Try manual fetch with credentials first to test
    const [manualData, setManualData] = useState(null);
    const [manualLoading, setManualLoading] = useState(true);
    const [manualError, setManualError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Making manual API call...");
                const response = await axios.get(`${server}/api/v1/admin/users`, {
                    withCredentials: true, // ✅ Ensure cookies are sent
                });
                
                console.log("Manual API response:", response.data);
                setManualData(response.data);
            } catch (error) {
                console.error("Manual API error:", error);
                setManualError(error);
            } finally {
                setManualLoading(false);
            }
        };

        fetchData();
    }, []);


        // ✅ Use manual data for now
    const loading = manualLoading;
    const data = manualData;
    const error = manualError;

    console.log("UserManagement - loading:", loading);
    console.log("UserManagement - data:", data);
    console.log("UserManagement - error:", error);

    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data && data.success && data.users) {
            console.log("Processing users:", data.users);
            setRows(data.users.map((user) => ({
                ...user,
                id: user._id,
                avatar: transformImage(user.avatar, 50) || "",
            })));
        }
    }, [data]);

  return (
    <AdminLayout>
        {loading ? <Skeleton height={"100vh"}/> : (
          <Table heading={"All Users"} columns={columns} rows={rows}/>
        )}
    </AdminLayout>
  )
}

export default UserManagement
