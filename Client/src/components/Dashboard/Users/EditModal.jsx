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

const EditModal = ({ open, handleClose, data, rolesdata, access, handleSave }) => {
  const [formData, setFormData] = React.useState({
    row_id : data.id,
    mongo_id : data.mongo_id,
    name: data.name || "",
    email: data.email || "",
    status: data.status || "Inactive",
    role: data.role || "Not Assigned",
  });

  React.useEffect(()=>{
     setFormData({
      row_id : data.id,
      mongo_id : data.mongo_id,
      name: data.name || "",
      email: data.email || "",
      status: data.status || "Inactive",
      role: data.role || "Not Assigned",
     })
  },[data]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  console.log(formData);
  
  const handleSubmit = () => {
    handleSave(formData);
    handleClose();
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
          Edit Details
        </Typography>
        {access ? <>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Name Field */}
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
          />

          {/* Email Field */}
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
          />

          {/* Status Field */}
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
            label="Roles"
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

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
          </Box></> : <p>Permission Denied. No access to perform the action</p>}
      </Box>
    </Modal>
  );
};

export default EditModal;
