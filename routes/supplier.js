const  express = require('express');
const db = require('../models');

//Middlewares
const isAuth = require('../app/Http/Middleware/authMiddleware');
const isLoggedIn = require('../app/Http/Middleware/isUserLoggedIn');
const role = require('../app/Http/Middleware/validateRoleMiddleware');

const supplierController = require('../app/Http/Controllers/Admin/Supplier/SupplierController');


const route = express.Router();
route.get('/', isAuth, role.validateRole("supplier"), supplierController.home);

module.exports = route;