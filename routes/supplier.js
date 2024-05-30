const  express = require('express');
const db = require('../models');

//Middlewares
const isAuth = require('../app/Http/Middleware/authMiddleware');
const isLoggedIn = require('../app/Http/Middleware/isUserLoggedIn');
const role = require('../app/Http/Middleware/validateRoleMiddleware');

const supplierController = require('../app/Http/Controllers/Admin/Supplier/SupplierController');


const route = express.Router();

route.get('/', isAuth, role.validateRole("supplier"), supplierController.home);
route.get('/view/:id',isAuth,role.validateRole("supplier"),supplierController.techpack_view);
route.get('/type',isAuth,role.validateRole("supplier"),supplierController.type);
route.get('/item',isAuth,role.validateRole("supplier"),supplierController.item);
route.get('/process/update/:id',isAuth,role.validateRole("supplier"),supplierController.edit_process);
route.get('/process',isAuth,role.validateRole("supplier"),supplierController.process);
route.get('/store',isAuth,role.validateRole("supplier"),supplierController.mystore);
route.get('/addprocess/:id',isAuth,role.validateRole("supplier"),supplierController.addprocess);
route.get('/edit_store/:id',isAuth,role.validateRole("supplier"),supplierController.edit_store);
route.get('/invoice',isAuth,role.validateRole("supplier"),supplierController.invoice);
route.get('/invoice_detail/:id',isAuth,role.validateRole("supplier"),supplierController.invoice_detail);


module.exports = route;