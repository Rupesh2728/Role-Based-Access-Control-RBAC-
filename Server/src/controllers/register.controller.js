const bcryptjs = require('bcryptjs');
const UserModel = require('../models/UserModel');
const nodemailer = require("nodemailer");
const validator = require('validator'); 

const CreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "67446f0b06fd3ee0bd59056e",
      status: "Inactive", 
    });

    const savedUser = await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: savedUser.email,
      subject: "Welcome to RBAC Dashboard",
      text: `Hello ${savedUser.name},\n\nWelcome to the RBAC Dashboard! Your account has been successfully created.\n\nPlease note that your access to the dashboard is pending until an administrator assigns a role to your account. Once a role is assigned, you can login.\n\nBest regards,\nRBAC Team`,
    };

    await transporter.sendMail(mailOptions);


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
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

module.exports = {
  CreateUser,
};
