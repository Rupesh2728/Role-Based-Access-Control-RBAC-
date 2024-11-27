import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '400px' }, // Responsive width
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const statuses = ['Active', 'Inactive'];
const permissionsOptions = ['Full Access', 'Manage Team', 'Limited Access'];

const AddModal = ({ open, handleClose, rolesdata, handleSave }) => {

  const [emailError, setEmailError] = React.useState(false);
  const [nameError, setnameError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [nameErrorMessage, setnameErrorMessage] = React.useState('');

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    status: 'Inactive',
    role : 'Not Assigned',
  });

  

  const handleSubmit = async () => {

    if (emailError) {
      console.log("Error");
      return;
    }

    const generatePassword = (length = 8) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const randomPassword = generatePassword();

    const emailPayload = {
      to: formData.email,
      subject: "Welcome to RBAC Dashboard",
      body : `Hello ${formData.name},\n\nWelcome to the RBAC Dashboard! Your account has been successfully created.\n\nHere are your login credentials:\n 
        Email: ${formData.email}\n Password: ${randomPassword}\n\n
      Please note that your access to the dashboard is pending until an administrator assigns a role to your account. Please frequently try to login to the dashboard.\n\nBest regards,\nRBAC Team`,
    };

    try {
      const res= await fetch("http://localhost:5000/users/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });
      const results = await res.json();
      console.log(results);

    } catch (error) {
      console.error("Error sending email:", error);
      return; 
    }
  
    handleSave({ ...formData, password: randomPassword });

    handleClose();

    setFormData({
      name: '',
      email: '',
      status: 'Inactive',
      role : 'Not Assigned',
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validateInputs = () => {
  let isValid = true;

  if (!formData.email || !isValidEmail(formData.email)) {
    setEmailError(true);
    setEmailErrorMessage('Please enter a valid email address.');
    isValid = false;
  } else {
    setEmailError(false);
    setEmailErrorMessage('');
  }

  if (!formData.name) {
    setnameError(true);
    setnameErrorMessage('Enter correct name!');
    isValid = false;
  } else {
    setnameError(false);
    setnameErrorMessage('');
  }

  return isValid;
};

const handleChange = (field) => (event) => {
  setFormData({ ...formData, [field]: event.target.value });
  validateInputs(formData.email);
};

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box sx={style}>
        <Typography id="edit-modal-title" variant="h6" component="h2">
          Add User
        </Typography>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
          />
          {nameError && <p className='text-[0.8rem] text-[red]'>{nameErrorMessage}</p>}

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
          />
          {emailError && <p className='text-[0.8rem] text-[red]'>{emailErrorMessage}</p>}

          <TextField
            label="Status"
            select
            value={formData.status}
            onChange={handleChange('status')}
            fullWidth
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Role"
            select
            value={formData.role}
            onChange={handleChange('role')}
            fullWidth
          >
            {rolesdata.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
          {
          !nameError && !emailError && formData.role !== 'Not Assigned' &&  
           <Button variant="contained" sx={{backgroundColor:'green', color:'white'}} onClick={handleSubmit}>
            Save
          </Button>
          }

          {
             (nameError || emailError || formData.role === 'Not Assigned') &&   
             <Button disabled={true} variant="contained" sx={{backgroundColor:'red', color:'white'}}>
               Save
            </Button>
          }
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddModal;
