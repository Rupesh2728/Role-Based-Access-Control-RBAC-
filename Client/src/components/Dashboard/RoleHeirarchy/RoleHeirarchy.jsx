import React,{useEffect, useState} from 'react'
import EditModal from './EditModal';
import { useDispatch, useSelector } from 'react-redux';
import {HierarchySliceactions} from '../../../store/Hierarchy'
import {Breadcrumbs,Stack, Typography, Box, Button } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const RoleHeirarchy = () => {
  const dispatch = useDispatch();
  const [edit_open, edit_setOpen] = useState(false);
  const edit_handleClose = () => edit_setOpen(false);

  const [roles,setroles]= useState([]);
  const [heirarchy,setheirarchy]= useState([]);


  const fetchRoles =async ()=>{
    const url = `http://localhost:5000/roles`
    const response = await fetch(url, {method: "get"});
    const result = await response.json();
    const rolesarr = [];
    for(let i=0;i<result.roles.length;i++)
    {   
       if(result.roles[i].role!=='not assigned')
           rolesarr.push(result.roles[i].role);
    }

    const url2 = `http://localhost:5000/heirarchy`
    const response2 = await fetch(url2, {method: "get"});
    const result2 = await response2.json();
   
    setheirarchy(result2.roles);
    console.log(result2.roles);
    dispatch(HierarchySliceactions.sethierarchy(result2.roles));
    setroles(rolesarr);  
  }

  const edit_handleOpen = () => {edit_setOpen(true); fetchRoles()};
  
  
  useEffect(()=>{
   fetchRoles();
  },[]);

  const edit_handleSave= async (hierarchy)=>{
    const obj = {
      hierarchy : hierarchy,
    }

    console.log(obj);
    
    const url = `http://localhost:5000/heirarchy`
    const response = await fetch(url, {
      method: "post", 
      headers: {
          "Content-Type": "application/json", 
      },
      body: JSON.stringify(obj),
  });

  const result = await response.json();
  console.log(result);
  fetchRoles();
  }

  const user_role = useSelector((state)=>state.access.access.role);

  const roleColors = ["#FF5722", "#2196F3", "#4CAF50", "#FFC107"];
  
  return (
   <>
    <EditModal open={edit_open} handleClose={edit_handleClose} 
     roles={roles}
     hierarchy_arr={heirarchy}
     handleSave={edit_handleSave}/>
    <div className='xs:w-[90%] lg:w-[80%]  flex justify-between m-auto mt-[4rem]'>
     {user_role==='admin' &&  <button onClick={edit_handleOpen} className="mr-[1rem] xs:w-[8rem] xs:h-[2.5rem] lg:w-[10rem] lg:h-[2.5rem] xs:text-[0.75rem] lg:text-[1rem] text-white bg-[green] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Role Hierarchy</button>      }
     {user_role!=='admin' &&  <div className='flex-col'>
      <button className="mr-[1rem] xs:w-[8rem] xs:h-[2.5rem] lg:w-[10rem] lg:h-[2.5rem] xs:text-[0.75rem] lg:text-[1rem] text-white bg-[red] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Role Hierarchy</button> 
      <p className='text-[red] text-[0.8rem] ml-7'>Access denied!!!</p>
      </div>     }
    </div>

    <Box sx={{ paddingBottom: "4rem", textAlign: "center" }}>
        <Box
          sx={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Role Hierarchy
          </Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {heirarchy.length === 0 && <p className='text-[1.1rem] text-[red]'>No Role Hierarchy is Set by Admin</p>}
            {heirarchy.length!==0 && heirarchy.map((role, index) => (
              <Button
                key={index}
                variant="contained"
                sx={{
                  backgroundColor: roleColors[index % roleColors.length],
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: roleColors[index % roleColors.length],
                    opacity: 0.8,
                  },
                }}
              >
                {role}
              </Button>
            ))}
          </Breadcrumbs>
        </Box>
      </Box>
   </>
  )
}

export default RoleHeirarchy