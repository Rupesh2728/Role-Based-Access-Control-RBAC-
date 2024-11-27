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

const ALLOWED_ROLES = ['admin', 'manager', 'employee', 'intern'];

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

const RoleItem = styled(Paper)(({ theme, isDragging }) => ({
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

const EditModal = ({ open, handleClose, roles, hierarchy_arr, handleSave }) => {
  const [hierarchy, setHierarchy] = React.useState(hierarchy_arr || []);
  const [All_roles_arr,setAll_roles_arr] = React.useState(roles || []);
  const [selectedRole, setSelectedRole] = React.useState('');
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('warning');

  React.useEffect(() => {
    setHierarchy(hierarchy_arr || []);
    setAll_roles_arr(roles || []);
  }, [hierarchy_arr,roles]);

  const handleDragStart = (e, role) => {
    setDraggedItem(role);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetRole) => {
    e.preventDefault();
    if (draggedItem === targetRole) return;

    const newHierarchy = [...hierarchy];
    const draggedIndex = newHierarchy.indexOf(draggedItem);
    const targetIndex = newHierarchy.indexOf(targetRole);

    newHierarchy.splice(draggedIndex, 1);
    newHierarchy.splice(targetIndex, 0, draggedItem);

    setHierarchy(newHierarchy);
  };

  const showAlertMessage = (message, severity = 'warning') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const addRole = () => {
    if (!selectedRole) {
      showAlertMessage('Please select a role to add');
      return;
    }

    if (hierarchy.includes(selectedRole)) {
      showAlertMessage('This role already exists in the hierarchy');
      return;
    }

    setHierarchy([...hierarchy, selectedRole]);
    setSelectedRole('');
    showAlertMessage('Role added successfully', 'success');
  };

  const removeRole = (role) => {
    setHierarchy(hierarchy.filter((r) => r !== role));
    showAlertMessage('Role removed from hierarchy', 'success');
  };

  const handleSubmit = () => {
    handleSave(hierarchy);
    handleClose();
  };

  const availableRoles = All_roles_arr.filter((role) => !hierarchy.includes(role));
  console.log(All_roles_arr);
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box sx={style}>
        <Typography id="edit-modal-title" variant="h6" component="h2" gutterBottom>
          Edit Role Hierarchy
        </Typography>

        <Box sx={{ mt: 2 }}>
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
              <InputLabel>Select Role</InputLabel>
             {availableRoles.length===0 &&  <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Select Role"
                disabled={true}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>}

              {
                availableRoles.length!==0 &&  
                <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Select Role"
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              }
            </FormControl>
            <Button
              variant="contained"
              onClick={addRole}
              startIcon={<AddIcon />}
              disabled={availableRoles.length === 0}
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
              overflowY: 'auto',
            }}
          >
            {hierarchy.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No roles in the hierarchy yet
              </Typography>
            ) : (
              hierarchy.map((role) => (
                <RoleItem
                  key={role}
                  elevation={1}
                  isDragging={draggedItem === role}
                  draggable
                  onDragStart={(e) => handleDragStart(e, role)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, role)}
                >
                  <DragIndicatorIcon color="action" />
                  <Typography sx={{ flex: 1 }}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeRole(role)}
                    aria-label="delete role"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </RoleItem>
              ))
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
