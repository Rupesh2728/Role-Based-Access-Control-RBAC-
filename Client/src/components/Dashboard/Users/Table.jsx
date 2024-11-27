import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const Table = ({rolesdata,userdata,fetchUserData}) => {

  const heirarchy = useSelector((state)=>state.hierarchy.hierarchy);
  const curr_user_role = useSelector((state)=>state.access.access.role);
  const permissions = useSelector((state)=>state.access.access.permissions);

  const [edit_open, edit_setOpen] = React.useState(false);
  const edit_handleOpen = () => edit_setOpen(true);
  const edit_handleClose = () => edit_setOpen(false);

  const [delete_open, delete_setOpen] = React.useState(false);
  const delete_handleOpen = () => delete_setOpen(true);
  const delete_handleClose = () => delete_setOpen(false);

  const [selecteddata,setselecteddata]= React.useState({});

  const canEdit = (currentUserRole, targetUserRole) => {
    const roleHierarchy = heirarchy; 
    if(currentUserRole === "admin")
      return true;

   if(heirarchy.length>0) 
   return roleHierarchy.indexOf(currentUserRole) < roleHierarchy.indexOf(targetUserRole);

    return true;
  };

  const [access,setaccess] = React.useState(true);

  const handleEditClick = (row) => {
    const access = canEdit(curr_user_role,row.role);
    console.log(access,curr_user_role,row.role,heirarchy);
    console.log(access);
    setaccess(access);
    setselecteddata(row);
    edit_handleOpen();
  };
  
  const handleDeleteClick = (row) => {
    const access = canEdit(curr_user_role,row.role);
    console.log(access,curr_user_role,row.role);
     setaccess(access);
     setselecteddata(row);
     delete_handleOpen();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, sortable: true },
    {
      field: 'name',
      headerName: 'Full name',
      width: 150,
      editable: false,
      sortable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      editable: false,
      sortable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      editable: false,
      sortable: false,
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      width: 300,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {params.row.permissions.map((permission, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'capitalize' }}
            >
              {permission}
            </Button>
          ))}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      editable: false,
      sortable: true,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 120,
      sortable: false,
      renderCell: (params) => (   
       permissions.update ? <IconButton
       color="primary"
       onClick={() => handleEditClick(params.row)}
       disableRipple
       style={{ cursor: 'pointer' }} 
     >
       <EditIcon />
     </IconButton>: <p>Acess denied</p>
      ),
    },
  
    {
      field: 'delete',
      headerName: 'Delete',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        permissions.delete ?<DeleteIcon
        className='text-[red]'
        onClick={() => handleDeleteClick(params.row)}
        style={{ cursor: 'pointer' }} 
      >
      </DeleteIcon> : <p>Access denied</p>
      ),
    },
  ];

  const edit_handleSave = async (formData)=>{
    const editdata = {
      id : formData.mongo_id,
      name : formData.name,
      email : formData.email,
      role_name : formData.role,
      status : formData.status,
    }
    
    const url = `http://localhost:5000/users/update`
    const response = await fetch(url, {
      method: "put", 
      headers: {
          "Content-Type": "application/json", 
      },
      body: JSON.stringify(editdata),
  });

  const result = await response.json();
  console.log(result);

  fetchUserData();
  }

  const delete_handleDelete = async (formData)=>{
    const url = `http://localhost:5000/users/delete/${formData.mongo_id}`
    const response = await fetch(url, {
      method: "delete", 
      headers: {
          "Content-Type": "application/json", 
      },
  });

  const result = await response.json();
  console.log(result);
  fetchUserData();
  }

  return (
    <>
    <EditModal open={edit_open} handleClose={edit_handleClose} 
     data={selecteddata}
     rolesdata={rolesdata}
     handleSave={edit_handleSave}
     access={access}/>

    <DeleteModal open={delete_open} handleClose={delete_handleClose} 
     data={selecteddata}
      handleSave={delete_handleDelete} access={access}/>
    
    <Box sx={{ height: '35rem', width: '80%', margin: 'auto', marginTop: '1rem' }}>
      {
        permissions.read ? <DataGrid sx={{paddingLeft:'1rem'}}
        rows={userdata}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        pageSizeOptions={[5]}
        
      /> : <p>Access Denied!!!</p>
      }
    </Box>

</>
  );
};

export default Table;
