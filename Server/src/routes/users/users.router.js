const express = require('express');
const { GetAllUsers,GetUserById,UpdateUser,DeleteUser,SendEmail,AddnewUser,Profile} = require('../../controllers/users.controller');

const UsersRouter = express.Router();

UsersRouter.get('/', GetAllUsers);

UsersRouter.get('/:id', GetUserById);

UsersRouter.put('/update', UpdateUser);

UsersRouter.delete('/delete/:id', DeleteUser);

UsersRouter.post('/send-email', SendEmail);

UsersRouter.post('/adduser', AddnewUser);

UsersRouter.put('/profile', Profile);



module.exports = UsersRouter;

