const RoleModel = require("../models/RolesModel");
const HeirarchyModel = require("../models/HeirarchyModel");
const UserModel = require("../models/UserModel");

const CreateRole = async (req, res) => {
    const { role, permissions } = req.body;

    if (!role || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
        return res.status(400).json({ message: 'Role and permissions are required, and permissions must be an array.' });
    }

    try {

        const normalizedRole = role.toLowerCase();

        const existingRole = await RoleModel.findOne({ role: normalizedRole });
        if (existingRole) {
            return res.status(409).json({ message: `Role '${role}' already exists.` });
        }

        const newRole = new RoleModel({ role: normalizedRole, permissions });
        await newRole.save();

        return res.status(201).json({
            message: 'Role created successfully',
            role: newRole
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating role', error: error.message });
    }
};

const GetAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find({});
        return res.status(200).json({
            message: 'Roles retrieved successfully',
            roles: roles
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
};

const UpdateRole = async (req, res) => {
    const { id, role, permissions } = req.body; 

    if (!id || (!role && !permissions)) {
        return res.status(400).json({ message: 'Role ID and at least one field (role or permissions) are required.' });
    }

    try {
        const updatedFields = {};
        if (role) updatedFields.role = role.toLowerCase();
        if (permissions) updatedFields.permissions = permissions;

        const updatedRole = await RoleModel.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedRole) {
            return res.status(404).json({ message: `Role with ID '${id}' not found.` });
        }

        return res.status(200).json({
            message: 'Role updated successfully',
            role: updatedRole
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

const DeleteRole = async (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: 'Role ID is required.' });
    }

    try {
        const updatedUsers = await UserModel.updateMany(
            { role: id }, 
            { role: "67446f0b06fd3ee0bd59056e", status: "Inactive" },
        );

        const deletedRole = await RoleModel.findByIdAndDelete(id);
        const deleted_role_name = deletedRole.role;

        console.log(deleted_role_name);
        const updatedDoc = await HeirarchyModel.updateOne(
            {}, 
            { $pull: { heirarchy: deleted_role_name } } 
        );
      
        if (!deletedRole) {
            return res.status(404).json({ message: `Role with ID '${id}' not found.` });
        }

        return res.status(200).json({
            message: 'Role deleted successfully',
            role: deletedRole
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};

const GetRoleById = async (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: 'Role ID is required.' });
    }

    try {
        const role = await RoleModel.findById(id);

        if (!role) {
            return res.status(404).json({ message: `Role with ID '${id}' not found.` });
        }

        return res.status(200).json({
            message: 'Role retrieved successfully',
            role: role
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving role', error: error.message });
    }
};

module.exports = {
    CreateRole,
    GetAllRoles,
    DeleteRole,
    UpdateRole,
    GetRoleById
};
