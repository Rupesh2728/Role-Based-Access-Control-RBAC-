import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ALLOWED_PERMISSIONS = ['read', 'create', 'update', 'delete'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '500px' },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const PermissionItem = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'move',
  backgroundColor: isDragging ? theme.palette.grey[100] : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
  },
  transition: 'background-color 0.2s ease',
}));

const EditModal = ({ open, handleClose, data, access, handleSave }) => {
  const [formData, setFormData] = React.useState({
    row_id: data.id,
    mongo_id: data.mongo_id,
    role: data.role,
    permissions: (data.permissions || []).map(p => p.toLowerCase()),
  });
 
  const [selectedPermission, setSelectedPermission] = React.useState('');
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('warning');

  React.useEffect(() => {
    setFormData({
      row_id: data.id,
      mongo_id: data.mongo_id,
      role: data.role,
      permissions: (data.permissions || []).map(p => p.toLowerCase()),
    });
  }, [data]);

  const handleDragStart = (e, permission) => {
    setDraggedItem(permission);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
   
  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };
  
  const handleDrop = (e, targetPermission) => {
    e.preventDefault();
    if (draggedItem === targetPermission) return;

    const newPermissions = [...formData.permissions];
    const draggedIndex = newPermissions.indexOf(draggedItem);
    const targetIndex = newPermissions.indexOf(targetPermission);

    newPermissions.splice(draggedIndex, 1);
    newPermissions.splice(targetIndex, 0, draggedItem);

    setFormData({
      ...formData,
      permissions: newPermissions
    });
  };

  const showAlertMessage = (message, severity = 'warning') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const addPermission = () => {
    if (!selectedPermission) {
      showAlertMessage('Please select a permission to add');
      return;
    }

    if (formData.permissions.includes(selectedPermission)) {
      showAlertMessage('This permission already exists');
      return;
    }

    setFormData({
      ...formData,
      permissions: [...formData.permissions, selectedPermission]
    });
    setSelectedPermission('');
    showAlertMessage('Permission added successfully', 'success');
  };

  const removePermission = (permission) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.filter(p => p !== permission)
    });
    showAlertMessage('Permission removed', 'success');
  };

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      permissions: formData.permissions.map(p => p.toLowerCase())
    };
    console.log("Hadle submit : ", finalFormData);
    
    handleSave(finalFormData);
    handleClose();
  };

  const availablePermissions = ALLOWED_PERMISSIONS.filter(
    p => !formData.permissions.includes(p)
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      
        <Box sx={style}>
        <Typography id="edit-modal-title" variant="h6" component="h2" gutterBottom>
          Edit Details
        </Typography>
      {access ? <>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            label="Role Name"
            value={formData.role}
            onChange={handleChange('role')}
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Permissions
            </Typography>

            <Collapse in={showAlert}>
              <Alert 
                severity={alertSeverity}
                sx={{ mb: 2 }}
                onClose={() => setShowAlert(false)}
              >
                {alertMessage}
              </Alert>
            </Collapse>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Permission</InputLabel>
                <Select
                  value={selectedPermission}
                  onChange={(e) => setSelectedPermission(e.target.value)}
                  label="Select Permission"
                >
                  {availablePermissions.map((permission) => (
                    <MenuItem key={permission} value={permission}>
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={addPermission}
                startIcon={<AddIcon />}
                disabled={availablePermissions.length === 0}
              >
                Add
              </Button>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minHeight: '100px',
                bgcolor: 'grey.50',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {formData.permissions.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  No permissions added yet
                </Typography>
              ) : (
                formData.permissions.map((permission) => (
                  <PermissionItem
                    key={permission}
                    elevation={1}
                    isDragging={draggedItem === permission}
                    draggable
                    onDragStart={(e) => handleDragStart(e, permission)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, permission)}
                  >
                    <DragIndicatorIcon color="action" />
                    <Typography sx={{ flex: 1 }}>
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removePermission(permission)}
                      aria-label="delete permission"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </PermissionItem>
                ))
              )}
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
        </> : <p>Permission Denied. No access to perform the action</p>}
      </Box>
      
    </Modal>
  );
};

export default EditModal;