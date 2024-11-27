import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import PeopleIcon from '@mui/icons-material/People';
import AirplanemodeInactiveIcon from '@mui/icons-material/AirplanemodeInactive';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useSelector } from 'react-redux';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));
 
 const Stats = () => {

  const users = useSelector((state)=>state.users.users);
  
  const [stats,setstats] = React.useState({});

  React.useEffect(()=>{
    const statsdata = {
       totalusers : users?.length || 0,
       activeusers : 0,
       inactiveusers : 0,
       admins : 0,
    }

    for(let i=0;i<users.length;i++)
      {
         if(users[i].role === 'admin')
           statsdata.admins += 1

         if(users[i].status === 'Active')
          statsdata.activeusers += 1

         if(users[i].status === 'Inactive')
          statsdata.inactiveusers += 1
      }
   
       setstats(statsdata);
  },[users]);

   return (
    <Box sx={{ flexGrow: 1,marginTop:'2.5rem' }} >
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} className="sm: mx-[2rem] lg:mx-[12rem]">
        <Grid size={{ xs: 2, sm: 3, md: 3 }}>
          <Item sx={{backgroundColor:'orange', color:'white'}}>
          <div >
      <div className='flex justify-between'>
          <div>
          <h3 className='font-bold text-[2.5rem]'>
            {stats.totalusers}
          </h3>

        <h4 className='text-[1rem]'>
          Total Users
        </h4>

          </div>
         <div className='m-auto mr-0'>
           <PeopleIcon className='text-white' sx={{ fontSize: 50 }}/>
         </div>
      </div>

    </div>
          </Item>
        </Grid>

        <Grid  size={{ xs: 2, sm: 3, md: 3 }}>
        <Item sx={{backgroundColor:'green', color:'white'}}>
         
      <div className='flex justify-between'>
          <div>
          <h3 className='font-bold text-[2.5rem]'>
            {stats.activeusers}
          </h3>

         <h4 className='text-[1rem]'>
           Active Users
         </h4>

          </div>
         <div className='m-auto mr-0'>
          <AirplanemodeActiveIcon className='text-white' sx={{ fontSize: 50 }}/>
         </div>
      </div>

          </Item>
        </Grid>

        <Grid  size={{ xs: 2, sm: 3, md: 3 }}>
        <Item sx={{backgroundColor:'red', color:'white'}}>
          <div >
      <div className='flex justify-between'>
          <div>
          <h3 className='font-bold text-[2.5rem]'>
            {stats.inactiveusers}
          </h3>

        <h4 className='text-[1rem]'>
          In-Active Users
        </h4>

          </div>
         <div className='m-auto mr-0'>
           <AirplanemodeInactiveIcon className='text-white' sx={{ fontSize: 50 }}/>
         </div>
      </div>

    </div>
          </Item>
        </Grid>

        <Grid  size={{ xs: 2, sm: 3, md: 3 }}>
        <Item sx={{backgroundColor:'blue', color:'white'}}>
          <div >
      <div className='flex justify-between'>
          <div>
          <h3 className='font-bold text-[2.5rem]'>
            {stats.admins}
          </h3>

        <h4 className='text-[1rem]'>
          Total Admins
        </h4>

          </div>
         <div className='m-auto mr-0'>
           <AdminPanelSettingsIcon className='text-white' sx={{ fontSize: 50 }}/>
         </div>
      </div>

    </div>
          </Item>
        </Grid>
    
    </Grid>
  </Box>
   )
 }
 
 export default Stats


