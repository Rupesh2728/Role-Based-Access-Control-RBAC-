import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import ProfileModal from './Profile/ProfileModal';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAccessActions } from '../../store/LoginAccess';

const pages = ['home','users'];

const TopBar = () => {

     const user_mongo_id = useSelector((state)=>state.access.access.id);
     const user_role = useSelector((state)=>state.access.access.role);
     const user_name = useSelector((state)=>state.access.access.name);
     const user_email = useSelector((state)=>state.access.access.email);

     const dispatch = useDispatch();
     const navigate = useNavigate();

     React.useEffect(() => {
    
      if (!user_mongo_id) {
        navigate("/");
      }
    }, [user_mongo_id, navigate]);
     
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };


    const handleSave=async (formData)=>{
      const editdata = 
      {
        id : formData.id,
        password : formData.newPassword,
        email : formData.email,
        name : formData.name,
      }
      
      const url = `http://localhost:5000/users/profile`
      const response = await fetch(url, {
        method: "put", 
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(editdata),
    });
  
    const result = await response.json();
    console.log(result);
    console.log(formData); 

    }

    const handleLogout=()=>{
       dispatch(LoginAccessActions.removeaccess());
       console.log(user_mongo_id);
       navigate('/');
    }
  
    return (<>

    <ProfileModal open={open} handleClose={handleClose} initialProfileData={{name: user_name ,email: user_email, id: user_mongo_id}}
     handleSave={handleSave}/>

    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
             RBAC Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
             <Link to={page}>
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
             </Link>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          > RBAC
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
             <Link to={page}>
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
             </Link>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display:'flex' }}>
          <button onClick={handleLogout} className="w-full mr-[1rem] text-white bg-[indianred] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Logout</button>      
              <IconButton onClick={handleOpen} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" />
              </IconButton>
            <p className='m-auto ml-[0.8rem]'>{user_role}</p>    
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  )
}

export default TopBar