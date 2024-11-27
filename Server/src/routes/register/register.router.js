const express = require('express');
const { CreateUser } = require('../../controllers/register.controller');

const RegisterRouter = express.Router();

RegisterRouter.post("/",CreateUser);

module.exports = RegisterRouter;