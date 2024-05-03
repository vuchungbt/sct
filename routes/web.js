const express = require('express');
const { check, body } = require('express-validator');
const db = require('../models');

//Middlewares
const isAuth = require('../app/Http/Middleware/authMiddleware');
const isLoggedIn = require('../app/Http/Middleware/isUserLoggedIn');
const role = require('../app/Http/Middleware/validateRoleMiddleware');

//Controllers
const homeController = require('../app/Http/Controllers/HomeController');
const loginController = require('../app/Http/Controllers/Auth/LoginController');
const registerController = require('../app/Http/Controllers/Auth/RegisterController');
const userController = require('../app/Http/Controllers/Admin/Users/UserController');
const roleController = require('../app/Http/Controllers/Admin/Roles/RoleController');
const supplierController = require('../app/Http/Controllers/Admin/Supplier/SupplierController');
const techpackController = require('../app/Http/Controllers/Admin/Techpack/TechpackController');
const invoiceController = require('../app/Http/Controllers/Admin/Invoice/InvoiceController');
const warehouseController = require('../app/Http/Controllers/Admin/Warehouse/WarehouseController');
const categoryController = require('../app/Http/Controllers/Admin/Category/CategoryController');
const clothController = require('../app/Http/Controllers/Admin/Cloth/ClothController');


const route = express.Router();

//Auth routes
route.get('/login', isLoggedIn, loginController.index);

route.post('/login', 
 body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail(),
 body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() , isLoggedIn, loginController.login);

route.post('/logout', loginController.logout);
route.get('/register', isLoggedIn,registerController.index);

route.post('/register',
        body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required!')
        .bail()
        .isLength({min: 1})
        .withMessage('Name must 1 charcters long!')
        .bail(),
        body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required!')
        .bail()
        .isEmail()
        .withMessage('Enter Valid Email!')
        .bail()
        .custom(value => {
            return db.User.findOne({ where : {email:value}}).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use');
                }   
            });
        })
        .bail(),
        body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required!')
        .bail() 
        .isLength({min: 5})
        .withMessage('Password is minimum 5 charcters long!')
        .bail()    
    ,registerController.register);


//Auth Routes
route.get('/home', isAuth ,homeController.home);

//Admin Routes

//Roles
route.get('/role/create',isAuth ,roleController.create);
route.post('/role/update/:id',isAuth,roleController.update);
route.get('/role/edit/:id',isAuth,roleController.edit);
route.post('/role/delete/:id',isAuth,roleController.delete);
route.post('/role/store',isAuth ,roleController.store);
route.get('/roles',isAuth, roleController.index);

//Users
route.get('/user/create',isAuth ,userController.create);
route.post('/user/update/:id',isAuth,userController.update);
route.get('/user/resetpw/:id',isAuth,userController.resetinfo);
route.post('/user/resetpw/:id',isAuth,userController.resetpw);
route.get('/user/edit/:id',isAuth,userController.edit);
route.post('/user/delete/:id',isAuth,userController.delete);
route.post('/user/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,userController.store);
route.get('/users', isAuth, role.validateRole("admin"), userController.index);

//Supplier
route.get('/supplier/create',isAuth ,supplierController.create);
route.post('/supplier/update/:id',isAuth,supplierController.update);
route.get('/supplier/edit/:id',isAuth,supplierController.edit);
route.post('/supplier/delete/:id',isAuth,supplierController.delete);
route.post('/supplier/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,supplierController.store);
route.get('/supplier', isAuth, role.validateRole("admin"), supplierController.index);

//Techpack
route.get('/techpack/create',isAuth ,techpackController.create);
route.get('/techpack/create/:id',isAuth ,techpackController.create);
route.post('/techpack/update/:id',isAuth,techpackController.update);
route.get('/techpack/edit/:id',isAuth,techpackController.edit);
route.post('/techpack/delete/:id',isAuth,techpackController.delete);
route.post('/techpack/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,techpackController.store);
route.get('/techpack', isAuth, role.validateRole("admin"), techpackController.index);

route.post('/techpack/upload',isAuth,techpackController.upload);

route.get('/techpack/detail/:id',isAuth,techpackController.detail);

//category
route.get('/category/create',isAuth ,categoryController.create);
route.post('/category/update/:id',isAuth,categoryController.update);
route.get('/category/edit/:id',isAuth,categoryController.edit);
route.post('/category/delete/:id',isAuth,categoryController.delete);
route.post('/category/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,categoryController.store);
route.get('/category', isAuth, role.validateRole("admin"), categoryController.index);

//cloth
route.get('/cloth/create',isAuth ,clothController.create);
route.post('/cloth/update/:id',isAuth,clothController.update);
route.get('/cloth/edit/:id',isAuth,clothController.edit);
route.post('/cloth/delete/:id',isAuth,clothController.delete);
route.post('/cloth/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,clothController.store);
route.get('/cloth', isAuth, role.validateRole("admin"), clothController.index);

//Invoice
route.get('/invoice/create',isAuth ,invoiceController.create);
route.post('/invoice/update/:id',isAuth,invoiceController.update);
route.get('/invoice/edit/:id',isAuth,invoiceController.edit);
route.post('/invoice/delete/:id',isAuth,invoiceController.delete);
route.post('/invoice/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,invoiceController.store);

route.post('/invoice/item',isAuth, role.validateRole("admin") ,invoiceController.additem);

route.get('/invoice', isAuth, role.validateRole("admin"), invoiceController.index);

//Warehouse
route.get('/warehouse/create',isAuth ,warehouseController.create);
route.post('/warehouse/update/:id',isAuth,warehouseController.update);
route.get('/warehouse/edit/:id',isAuth,warehouseController.edit);
route.post('/warehouse/delete/:id',isAuth,warehouseController.delete);
route.post('/warehouse/store',
body('name')
.not()
.isEmpty()
.withMessage('Name is required!')
.bail()
.isLength({min: 1})
.withMessage('Name must 1 charcter long!')
.bail(),

body('tel'),

body('status')
.not()
.isEmpty()
.withMessage('Status is required!')
.bail(),

body('email')
.not()
.isEmpty()
.withMessage('Email is required!')
.bail()
.isEmail()
.withMessage('Enter Valid Email!')
.bail()
.custom(value => {
    return db.User.findOne({ where : {email:value}}).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }   
    });
})
.bail(),
body('password')
.not()
.isEmpty()
.withMessage('Password is required!')
.bail() 
.isLength({min: 5})
.withMessage('Password is minimum 5 charcters long!')
.bail()    
,isAuth, role.validateRole("admin") ,warehouseController.store);
route.get('/warehouse', isAuth, role.validateRole("admin"), warehouseController.index);



//User Routes

//Home Page routes
route.get('/',homeController.welcome);


module.exports = route;