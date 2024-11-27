import { useEffect } from "react";
import Content from "./Content";
import { useDispatch, useSelector } from "react-redux";
import { UserSliceactions } from "../../../store/UsersSlice";
import { RolesSliceactions } from "../../../store/RolesSlice";
import RoleHeirarchy from "../RoleHeirarchy/RoleHeirarchy";

const HomePage = () => {


  const dispatch = useDispatch();

  const fetchUserData = async () =>{
    const url = `http://localhost:5000/users`
    const response = await fetch(url, {method: "get"});
    const result = await response.json();
    const usersarr=[]
    for(let i=0; i<result.users.length; i++)
    { 
      let result2;
      if(result.users[i].role!=="")
       {
        const res = await fetch(`http://localhost:5000/roles/${result.users[i].role}`);
        result2 = await res.json();
       }
        
      const obj ={
        id: i+1,
        mongo_id :  result.users[i]._id,
        name : result.users[i].name,
        email : result.users[i].email,
        role : result2.role.role || "Not Assgined",
        status : result.users[i].status,
        permissions : result2.role.permissions || [],
      }
        usersarr.push(obj);
    }
  
    dispatch(UserSliceactions.setusers(usersarr)); 
  }

  const fetchRoles =async ()=>{
    const url = `http://localhost:5000/roles`
    const response = await fetch(url, {method: "get"});
    const result = await response.json();
    const rolesarr = [];
    for(let i=0;i<result.roles.length;i++)
    {   
      const obj={
         id : i+1,
         role : result.roles[i].role,
         permissions : result.roles[i].permissions,
         mongo_id : result.roles[i]._id,
       }

       rolesarr.push(obj);
    }
    
    dispatch(RolesSliceactions.setroles(rolesarr));
  }
   
  useEffect(()=>{
     fetchRoles();
     fetchUserData();
  },[]);
  
  return (
    <>
      <Content />
      <RoleHeirarchy/>
    </>
  );
};
export default HomePage;
