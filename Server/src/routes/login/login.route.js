const express = require('express');
const { Login } = require('../../controllers/login.controller');

const LoginRouter = express.Router();

LoginRouter.post('/', Login);

module.exports = LoginRouter;