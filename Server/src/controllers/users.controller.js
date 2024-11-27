const RoleModel = require('../models/RolesModel');
const UserModel = require('../models/UserModel');
const nodemailer = require("nodemailer");
const validator = require('validator'); 
const bcryptjs = require('bcryptjs');

const GetAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
            .populate('role') // Populate role details
            .select('-password'); // Exclude password from the result

        return res.status(200).json({
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

const GetUserById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const user = await UserModel.findById(id)
            .populate('role') // Populate role details
            .select('-password'); // Exclude password from the result

        if (!user) {
            return res.status(404).json({ message: `User with ID '${id}' not found.` });
        }

        return res.status(200).json({
            message: 'User retrieved successfully',
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

const UpdateUser = async (req, res) => {
    const { id, name, email, role_name, status } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required for updating.' });
    }

    try {
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;

        const role = await RoleModel.findOne({ role : role_name});
        
        if (role) updatedFields.role = role._id;
        if (status) updatedFields.status = status;

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true } 
        )
            .populate('role') 
            .select('-password'); 

        if (!updatedUser) {
            return res.status(404).json({ message: `User with ID '${id}' not found.` });
        }

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

const DeleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: `User with ID '${id}' not found.` });
        }

        return res.status(200).json({
            message: 'User deleted successfully',
            user: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email,
                role: deletedUser.role,
                status: deletedUser.status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};


const SendEmail = async (req,res)=>{
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL, 
        to, 
        subject, 
        text: body, 
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
}

const AddnewUser=async (req,res)=>{
    try {
        const { name, email, password, role_name,status } = req.body;
    
        if (!email || !validator.isEmail(email)) {
          return res.status(400).json({
            message: "Please enter a valid email address.",
            error: true,
          });
        }
    
    
        const checkEmail = await UserModel.findOne({ email: email });
        if (checkEmail) {
          return res.status(400).json({
            message: "User already exists.",
            error: true,
          });
        }
    
     
        if (!password || password.length < 6) {
          return res.status(400).json({
            message: "Password must be at least 6 characters long.",
            error: true,
          });
        }
    
    
        if (!name || name.trim().length === 0) {
          return res.status(400).json({
            message: "Please provide a valid name.",
            error: true,
          });
        }
    
    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
    
        const role_obj = await RoleModel.findOne({ role : role_name});
        
        const newUser = new UserModel({
          name,
          email,
          password: hashedPassword,
          role: role_obj._id,
          status, 
        });
    
        const savedUser = await newUser.save();

        return res.status(201).json({
            message: "New user created successfully. Welcome email sent!",
            data: {
              id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
              role: savedUser.role,
              status: savedUser.status,
            },
            success: true,
          });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false,
          });
    }
}

const Profile = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
 
    if (!id) {
      return res.status(400).json({
        message: "User ID is required.",
        error: true,
      });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
        error: true,
      });
    }

    if (email) {
      const checkEmail = await UserModel.findOne({ email: email });
      if (checkEmail && checkEmail._id.toString() !== id) {
        return res.status(400).json({
          message: "Email is already in use by another user.",
          error: true,
        });
      }
    }

  
    if (name && name.trim().length === 0) {
      return res.status(400).json({
        message: "Please provide a valid name.",
        error: true,
      });
    }


    let hashedPassword;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long.",
          error: true,
        });
      }
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }


    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = hashedPassword;

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true, 
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
      });
    }

    return res.status(200).json({
      message: "User updated successfully.",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error.",
      error: true,
      success: false,
    });
  }
};





module.exports = {
    GetAllUsers,
    GetUserById,
    UpdateUser,
    DeleteUser,
    SendEmail,
    AddnewUser,
    Profile
  
};
