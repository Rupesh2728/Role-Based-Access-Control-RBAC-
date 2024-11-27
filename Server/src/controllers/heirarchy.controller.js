const HeirarchyModel = require("../models/HeirarchyModel");
const RolesModal = require("../models/RolesModel");

const Heirarchy = async (req, res) => {
    const {hierarchy} = req.body;
    if (!Array.isArray(hierarchy ) || hierarchy .length === 0) {
      return res.status(400).json({ error: 'Heirarchy must be a non-empty array.' });
    }
  
    try {
      const heirarchyDoc= await HeirarchyModel.updateOne({}, { $set: { hierarchy: hierarchy } },  { upsert: true } );
      res.status(201).json({ message: 'Heirarchy saved successfully', data: heirarchyDoc });
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error saving heirarchy:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
      }
    }
  }

 const GetAllHeirarchy=async (req,res)=>{
  try {
    const heirarchy_roles = await HeirarchyModel.find();
        
    return res.status(200).json({
        message: 'Heirarchy retrieved successfully',
        roles : heirarchy_roles[0].hierarchy
    });

} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving Heirarchy', error: error.message });
}
 }

 const DeleteRole = async (req, res) => {
  const { role } = req.body; 
  console.log(role);
  
  if (!role) {
      return res.status(400).json({ message: 'Role name is required.' });
  }

  try { 
      const heirarchyDoc = await HeirarchyModel.findOne({}); 
      
      if (!heirarchyDoc) {
          return res.status(404).json({ message: 'Heirarchy document not found.' });
      }

      const heirarchy_arr = heirarchyDoc.hierarchy;

      const newarr = heirarchy_arr.filter((ele) => ele !== role);

      const updatedDoc= await HeirarchyModel.updateOne({}, { $set: { hierarchy: newarr } },  { upsert: true } );

      if (updatedDoc.modifiedCount === 0) {
          return res.status(404).json({ message: `Role '${role}' not found in heirarchy.` });
      }

      return res.status(200).json({
          message: 'Role deleted successfully',
          updatedHeirarchy: newarr 
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting role', error: error.message });
  }
};


const UpdateRole = async (req, res) => {
  const { role, id } = req.body; 
  console.log(role);
  
  if (!role) {
      return res.status(400).json({ message: 'Role name is required.' });
  }

  try { 
      const heirarchyDoc = await HeirarchyModel.findOne({}); 

      const roleobj = await RolesModal.findById(id);

      const oldrolename = roleobj.role;
      
      if (!heirarchyDoc) {
          return res.status(404).json({ message: 'Heirarchy document not found.' });
      }

      const heirarchy_arr = heirarchyDoc.hierarchy;

      const newarr = heirarchy_arr.map(item => 
        item === oldrolename ? role : item
    );
    
      const updatedDoc= await HeirarchyModel.updateOne({}, { $set: { hierarchy: newarr } },  { upsert: true } );

      if (updatedDoc.modifiedCount === 0) {
          return res.status(404).json({ message: `Role '${role}' not found in heirarchy.` });
      }

      return res.status(200).json({
          message: 'Role Name Edited successfully',
          updatedHeirarchy: newarr 
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error Editing role name', error: error.message });
  }
}

module.exports = {
  Heirarchy,
  GetAllHeirarchy,
  DeleteRole,
  UpdateRole
};
