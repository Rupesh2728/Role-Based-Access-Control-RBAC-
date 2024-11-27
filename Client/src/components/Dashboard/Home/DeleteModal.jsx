import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "400px" }, // Responsive width
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const DeleteModal = ({ open, handleClose, data, access, handleSave }) => {
    
  const [formData, setFormData] = React.useState({
    row_id : data.id,
    mongo_id : data.mongo_id,
    role: data.role,
    permissions : data.permissions || [],
  });

  React.useEffect(() => {
    setFormData({
        row_id : data.id,
        mongo_id : data.mongo_id,
        role: data.role,
        permissions : data.permissions || [],
      });
  }, [data]);

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
          Confirm to Delete the Role ?
        </Typography>
        {access ? <>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <div className="mb-0">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Role Name
            </label>
            <input
              type="text"
              id="status"
              value={formData.role}
              readOnly
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
            />
          </div>

          <div className="flex-col">
          <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
             Permissions
            </label>
           <div>
           {formData.permissions.length!=0 && formData.permissions.map((permission) => (
              <button
                key={permission}
                className="bg-slate-300 mx-1 text-[0.85rem] p-2 rounded-lg"
              >
                {permission}
              </button>
            ))}
           </div>
          </div>

         
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "red", color: "white" }}
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </Box>
          </Box></> : <p>Permission Denied. No access to perform the action</p>}
        </Box>
    </Modal>
  );
};

export default DeleteModal;
