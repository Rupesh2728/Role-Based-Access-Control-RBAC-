import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { Avatar } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '400px' },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const ProfileModal = ({
  open,
  handleClose,
  initialProfileData,
  handleSave,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState({
    name: false,
    email: false,
    newPassword: false,
  });

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    newPassword: '',
    id : '',
  });

  React.useEffect(() => {
    setFormData({
      id : initialProfileData?.id,
      name: initialProfileData?.name,
      email: initialProfileData?.email,
      newPassword: '',
    });
  }, []);

  const [errors, setErrors] = React.useState({
    name: '',
    email: '',
    newPassword: '',
  });

  const isValidName = (name) => {
    return name.trim().length >= 2;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    const newErrors = {
      name: '',
      email: '',
      newPassword: '',
    };

    if (!isValidName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === '');
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      id : formData.id,
    };

    if (formData.newPassword) {
      payload.newPassword = formData.newPassword;
    }

    handleSave(payload);
    setFormData({
      ...formData,
      newPassword : '',
    })
    handleClose();
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="profile-modal-title">
      <Box sx={style}>
        <Typography id="profile-modal-title" variant="h6" component="h2" sx={{display:'flex', justifyContent:'center', fontSize:'1.5rem', fontWeight:'600'}}>
          <div>Profile</div>
        </Typography>
        <div className='flex justify-center'>
        <Avatar alt="Remy Sharp" sx={{width:'8rem', height:'8rem'}} src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" />
        </div>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Name Field */}
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              readOnly: !isEditing.name,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleEdit('name')}>
                    <EditIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Email Field */}
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              readOnly: !isEditing.email,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleEdit('email')}>
                    <EditIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
            fullWidth
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            InputProps={{
              readOnly: !isEditing.newPassword,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleEdit('newPassword')}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
