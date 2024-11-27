import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Stats from "./Stats";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { Button } from "@mui/material";
import AddModal from "./AddModal";
import { useDispatch, useSelector } from "react-redux";
import {RolesSliceactions} from '../../../store/RolesSlice';

const Content = () => {

  const dispatch = useDispatch();
   
  const heirarchy = useSelector((state)=>state.hierarchy.hierarchy);
  const curr_user_role = useSelector((state)=>state.access.access.role);
  const permissions = useSelector((state)=>state.access.access.permissions);

  console.log(heirarchy);
  
  const canEdit = (currentUserRole, targetUserRole) => {
    const roleHierarchy = heirarchy || []; 
    
    if(currentUserRole === "admin")
       return true;

    if(heirarchy.length>0) 
    return roleHierarchy.indexOf(currentUserRole) < roleHierarchy.indexOf(targetUserRole);

     return true;
  };


  const [rolesdata,setrolesdata] = React.useState([]);

  const [edit_open, edit_setOpen] = React.useState(false);
  const edit_handleOpen = () => edit_setOpen(true);
  const edit_handleClose = () => edit_setOpen(false);

  const [delete_open, delete_setOpen] = React.useState(false);
  const delete_handleOpen = () => delete_setOpen(true);
  const delete_handleClose = () => delete_setOpen(false);

  const [add_open, add_setOpen] = React.useState(false);
  const add_handleOpen = () => add_setOpen(true);
  const add_handleClose = () => add_setOpen(false);

  const [selecteddata,setselecteddata]= React.useState({});

  const fetchRoles =async ()=>{
    const url = `http://localhost:5000/roles`
    const response = await fetch(url, {method: "get"});
    const result = await response.json();
    console.log(result);
    const rolesarr = [];
    let serial_num = 0;
    for(let i=0;i<result.roles.length;i++)
    {   
       if(result.roles[i].role==="not assigned")
       {
            continue;
       }

      const obj={
         id : ++serial_num,
         role : result.roles[i].role,
         permissions : result.roles[i].permissions,
         mongo_id : result.roles[i]._id,
       }

       rolesarr.push(obj);
    }
    setrolesdata(rolesarr);
  }



  React.useEffect(()=>{
    fetchRoles();
  },[]);

  const [access,setaccess] = React.useState(true);

  const handleEditClick = (row) => {
    const access = canEdit(curr_user_role,row.role);
    console.log(access,curr_user_role,row.role);
    
    setaccess(access);
    setselecteddata(row);
    edit_handleOpen();
  };
  
  const handleDeleteClick = (row) => {
     const access = canEdit(curr_user_role,row.role);
     setaccess(access);
     setselecteddata(row);
     delete_handleOpen();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, sortable: true },
    {
      field: 'role',
      headerName: 'Role Name',
      width: 150,
      editable: false,
      sortable: true,
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
      field: 'edit',
      headerName: 'Edit',
      width: 150,
      sortable: false,
      renderCell: (params) => (   
        permissions.update ? <IconButton
          color="primary"
          onClick={() => handleEditClick(params.row)}
          disableRipple
          style={{ cursor: 'pointer' }} 
        >
          <EditIcon />
        </IconButton> : <p>Access Denied</p>
      ),
    },
  
    {
      field: 'delete',
      headerName: 'Delete',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        permissions.delete ? <DeleteIcon
          className='text-[red]'
          onClick={() => handleDeleteClick(params.row)}
          style={{ cursor: 'pointer' }} 
        >
        </DeleteIcon> : <p>Access Denied</p>
      ),
    },
  ];


  const edit_handleSave = async (formData)=>{
    const editdata = {
      id : formData.mongo_id,
      role: formData.role,
      permissions : formData.permissions
    }

    const url2 = `http://localhost:5000/heirarchy/edit`;
    const response2 = await fetch(url2, {
      method: "post", 
      headers: {
          "Content-Type": "application/json", 
      },
      body: JSON.stringify({role : editdata.role, id : editdata.id}),
  });
  
    const result2 = await response2.json();
    console.log(result2);
    
    const url = `http://localhost:5000/roles/update`
    const response = await fetch(url, {
      method: "put", 
      headers: {
          "Content-Type": "application/json", 
      },
      body: JSON.stringify(editdata),
  });

  const result = await response.json();
  console.log(result);

  fetchRoles();
  window.location.reload();
  }

  const delete_handleDelete = async (formData)=>{
    const url = `http://localhost:5000/roles/delete/${formData.mongo_id}`
    const response = await fetch(url, {
      method: "delete", 
      headers: {
          "Content-Type": "application/json", 
      },
  });
  
  const result = await response.json();
  console.log(result);

  const url2 = `http://localhost:5000/heirarchy/update`;
  const response2 = await fetch(url2, {
    method: "post", 
    headers: {
        "Content-Type": "application/json", 
    },
    body: JSON.stringify({role : formData.role}),
});

  const result2 = await response2.json();
  console.log(result2);
  fetchRoles();
  window.location.reload();
  }

  const addnewrole =async (formData)=>{
    const obj={
      role : formData.role,
      permissions: formData.permissions,
    };

    console.log(obj);

  try{
    const url = `http://localhost:5000/roles/create`
    const response = await fetch(url, {
      method: "post", 
      headers: {
          "Content-Type": "application/json", 
      },
      body: JSON.stringify(obj),
  });

  const results = await response.json();
  console.log(results);
  }

  catch (error) {
    console.error("Error sending email:", error);
    return; 
  }

    fetchRoles();
  }

  return (
    <>
     <AddModal open={add_open} handleClose={add_handleClose} 
     handleAdd={addnewrole}/>

    <EditModal open={edit_open} handleClose={edit_handleClose} 
     data={selecteddata} access={access}
     handleSave={edit_handleSave}/>

    <DeleteModal open={delete_open} handleClose={delete_handleClose} 
     data={selecteddata} access={access}
      handleSave={delete_handleDelete}/>

      <Stats />

      <div className='xs:w-[90%] lg:w-[80%]  flex justify-between m-auto mt-[4rem]'>
        {permissions.create ? <button onClick={add_handleOpen} className="mr-[1rem] xs:w-[6rem] xs:h-[2.5rem] lg:w-[7rem] lg:h-[2.5rem] xs:text-[0.75rem] lg:text-[1rem] text-white bg-[green] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add Role</button>      
        : 
        <div className="flex-col">
        <button disabled={true} className="mr-[1rem] xs:w-[6rem] xs:h-[2.5rem] lg:w-[7rem] lg:h-[2.5rem] xs:text-[0.75rem] lg:text-[1rem] text-white bg-[red] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add Role</button>
        <p className='text-[red] text-[0.8rem] ml-2'>Access denied!!!</p>
        </div>
        }
      </div>
      <Box
        sx={{ height: 400, width: "80%", margin: "auto", marginTop: "1rem" }}
      >
       {permissions.read &&  <DataGrid
          sx={{ paddingLeft: "2rem" }}
          rows={rolesdata}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />}

        {
          !permissions.read && <p>Access Denied to View Data!!!</p>
        }
      </Box>
    </>
  );
};

export default Content;
