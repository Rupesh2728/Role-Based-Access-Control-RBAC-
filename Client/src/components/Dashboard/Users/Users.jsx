import React,{useState,useEffect} from 'react';
import Table from './Table';
import SearchIcon from "@mui/icons-material/Search";
import AddModal from './AddModal';
import { useSelector } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export const Users = () => {

  const heirarchy = useSelector((state)=>state.hierarchy.hierarchy);
  const curr_user_role = useSelector((state)=>state.access.access.role);
  const permissions = useSelector((state)=>state.access.access.permissions);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [rolesdata,setrolesdata] = useState([]);
    const [userdata,setuserdata] =   useState([]);

  const fetchUserData = async () =>{
    const url = `http://localhost:5000/users`
    const response = await fetch(url, {method: "get"});
    const result = await response.json();
    console.log(result);
    const usersarr=[];
    let serial_num =0;
    for(let i=0; i<result.users.length; i++)
    { 
      let result2;
      if(result.users[i].role!=="")
       {
        const res = await fetch(`http://localhost:5000/roles/${result.users[i].role}`);
        result2 = await res.json();
       }

       if(result2.role.role==="admin") 
        {
            continue;
        } 
       
        serial_num+=1;
              
      const obj ={
        id: serial_num,
        mongo_id :  result.users[i]._id,
        name : result.users[i].name,
        email : result.users[i].email,
        role : result2.role.role,
        status : result.users[i].status,
        permissions : result2.role.permissions || [],
      }
          usersarr.push(obj);
    }

    setuserdata(usersarr);
    console.log(usersarr);    
  }

    const fetchRoles =async ()=>{
      const url = `http://localhost:5000/roles`
      const response = await fetch(url, {method: "get"});
      const result = await response.json();
      console.log(result);
      const rolesarr = [];
      for(let i=0;i<result.roles.length;i++)
      {
         rolesarr.push(result.roles[i].role);
      }
      setrolesdata(rolesarr);
    }

  useEffect(()=>{
      fetchRoles();
      fetchUserData();
   },[]);

    const Add_newuser_handleSave = async (formData)=>{
      const obj={
        name : formData.name,
        email : formData.email,
        password : formData.password,
        role_name : formData.role,
        status : formData.status,
      };

      console.log(obj);
      
    try{
      const url = `http://localhost:5000/users/adduser`
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

    fetchUserData();
  }

  return (
    <>
     <AddModal open={open} handleClose={handleClose} rolesdata={rolesdata}
      handleSave={Add_newuser_handleSave}/>
        <div className='xs:w-[90%] lg:w-[80%]  flex justify-between m-auto mt-[2rem]'>
        {permissions.create && <button onClick={handleOpen} className="mr-[1rem] xs:w-[6rem] xs:h-[2.5rem] lg:w-[7rem] lg:h-[2.5rem] xs:text-[0.75rem] lg:text-[1rem] text-white bg-[green] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add User</button>}      
       {!permissions.create && 
       <div className='felx flex-col'>
       <button disabled={true} className="mr-[1rem] xs:w-[6rem] xs:h-[2.5rem] lg:w-[7rem] lg:h-[2.5rem] xs:text-[0.75rem] lg:text-[1rem] text-white bg-[red] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add User</button>
       <p className='text-[red] text-[0.8rem] ml-2'>Access denied!!!</p>
      </div>
      }
        </div>
        <Table rolesdata={rolesdata} userdata={userdata} fetchUserData={fetchUserData}/>
    </>
  )
}





