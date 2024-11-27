const express = require('express');
const { Heirarchy,GetAllHeirarchy, DeleteRole,UpdateRole } = require('../../controllers/heirarchy.controller');

const HeirarchyRouter = express.Router();

HeirarchyRouter.post("/",Heirarchy);

HeirarchyRouter.get("/",GetAllHeirarchy);

HeirarchyRouter.post("/update", DeleteRole);

HeirarchyRouter.post("/edit", UpdateRole);

module.exports = HeirarchyRouter;