const express = require('express');
const { CreateRole, GetAllRoles, UpdateRole, DeleteRole,GetRoleById } = require('../../controllers/roles.router');

const RolesRouter = express.Router();

RolesRouter.post('/create', CreateRole);

RolesRouter.get('/', GetAllRoles);

RolesRouter.get('/:id', GetRoleById);

RolesRouter.put('/update', UpdateRole);

RolesRouter.delete('/delete/:id', DeleteRole);

module.exports = RolesRouter;

