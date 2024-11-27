const UserModel = require("../models/UserModel");
const RoleModel = require("../models/RolesModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email }).populate("role");
    if (!user) {
      return res.status(400).json({
        message: "User does not exist. Please register first.",
        error: true,
        success: false,
      });
    }
    
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect password. Please try again.",
        error: true,
        success: false,
      });
    }

    if (user.role==="67446f0b06fd3ee0bd59056e") {
      return res.status(403).json({
        message: "Access denied. Your role has not been assigned yet.",
        error: true,
        success: false,
      });
    }

  const roleobj = await RoleModel.findOne({_id:user.role});
  const permissions_obj = {
    create : false,
    read : false,
    update : false,
    delete : false,
  };

  for(i=0;i<roleobj.permissions.length;i++)
  {
     if(roleobj.permissions[i] === "create")
       permissions_obj.create = true;
     else if(roleobj.permissions[i] === "read") 
       permissions_obj.read = true;
     else if(roleobj.permissions[i] === "update") 
       permissions_obj.update = true;
     else 
       permissions_obj.delete = true;
  }

    const tokenData = {
      id: user._id,
      email: user.email,
      role: roleobj.role,
      permissions : permissions_obj, 
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d", 
    });

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 24 * 60 * 60 * 1000, 
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: roleobj.role, 
        permissions : permissions_obj,
      },
      success: true,
    });
    
  } catch (err) {

    return res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

module.exports = {
  Login,
};
