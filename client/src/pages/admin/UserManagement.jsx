import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/Layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar } from '@mui/material';
import { dashboardData } from '../../constants/sampleData';
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

  const [rows , setRows] = useState([]);

  useEffect( () => {
    setRows(dashboardData.users.map((i) => ({...i , id:i._id , avatar: transformImage(i.avatar , 50)})))
  },[])

  return (
    <AdminLayout>
        <Table heading={"All Users"} columns={columns} rows={rows}/>
    </AdminLayout>
  )
}

export default UserManagement
