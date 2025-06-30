import React, { useState } from 'react'
import AdminLayout from '../../components/Layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar } from '@mui/material';



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

function UserManagement() {

  const [rows , setRows] = useState([]);

  return (
    <AdminLayout>
        <Table heading={"All users"} columns={columns} rows={rows}/>
    </AdminLayout>
  )
}

export default UserManagement
