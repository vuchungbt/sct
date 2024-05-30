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
const typeController = require('../app/Http/Controllers/Admin/Type/TypeController');

const historyController = require('../app/Http/Controllers/Admin/SystemHistory/HistoryController');
const notifyController = require('../app/Http/Helper/NotifyController');

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
route.get('/role/create', role.validateRole("admin"),isAuth ,roleController.create);
route.post('/role/update/:id',isAuth, role.validateRole("admin"),roleController.update);
route.get('/role/edit/:id',isAuth, role.validateRole("admin"),roleController.edit);
route.post('/role/delete/:id',isAuth, role.validateRole("admin"),roleController.delete);
route.post('/role/store',isAuth , role.validateRole("admin"),roleController.store);
route.get('/roles',isAuth , role.validateRole("admin"), roleController.index);

//Users ,role.validateRole(["admin","manager"])
route.get('/user/create',isAuth ,role.validateRole(["admin","manager"]),userController.create);
route.post('/user/update/:id',isAuth,userController.update);
route.get('/user/resetpw/:id',isAuth,userController.resetinfo);
route.get('/superuser/changeinfo/:id',isAuth,userController.changeinfo);
route.post('/user/resetpw/:id',isAuth,userController.resetpw);
route.post('/user/updatepw/:id',isAuth,userController.updatepw);
route.get('/superuserpw/updatepw/:id',isAuth,userController.updatepw_info);
route.get('/user/edit/:id',isAuth,role.validateRole(["admin","manager"]),userController.edit);
route.post('/user/delete/:id',isAuth,role.validateRole(["admin","manager"]),userController.delete);
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
,isAuth,role.validateRole(["admin","manager"]),userController.store);
route.get('/users', isAuth,role.validateRole(["admin","manager"]), userController.index);

//Supplier
route.get('/supplier/create',isAuth , role.validateRole(["admin","hr"]),supplierController.create);
route.post('/supplier/update/:id',isAuth, role.validateRole(["admin","hr"]),supplierController.update);
route.get('/supplier/edit/:id',isAuth, role.validateRole(["admin","hr"]),supplierController.edit);
route.post('/supplier/delete/:id', role.validateRole(["admin","hr"]),isAuth,supplierController.delete);
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
,isAuth, role.validateRole("admin"), role.validateRole(["admin","hr"]) ,supplierController.store);
route.get('/supplier', isAuth, role.validateRole(["admin","hr"]), supplierController.index);

//Techpack ,role.validateRole(["admin","manager","user"])
route.get('/techpack/create',isAuth,role.validateRole(["admin","manager","user"]) ,techpackController.create);
route.get('/techpack/item/create',isAuth ,role.validateRole(["admin","manager","user"]),techpackController.create);
route.get('/techpack/create/:id',isAuth ,role.validateRole(["admin","manager","user"]),techpackController.create);
route.post('/techpack/update/:id',isAuth,role.validateRole(["admin","manager","user"]),techpackController.update);
route.get('/techpack/edit/:id',isAuth,role.validateRole(["admin","manager","user"]),techpackController.edit);
route.post('/techpack/delete/:id',isAuth,role.validateRole(["admin","manager","user"]),techpackController.delete);
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
,isAuth,role.validateRole(["admin","manager","user"]),techpackController.store);
route.get('/techpack', isAuth,role.validateRole(["admin","manager","user","hr"]), techpackController.index);

route.post('/techpack/upload',isAuth,role.validateRole(["admin","manager","user"]),techpackController.upload);
route.post('/techpack/confirm/:id',isAuth,role.validateRole(["admin","manager"]),techpackController.confirm);
route.post('/techpack/verify/:id',isAuth,role.validateRole(["admin","manager"]),techpackController.verify);
route.post('/techpack/product',isAuth,role.validateRole(["admin","manager","user"]),techpackController.product);
route.get('/techpack/process/:id',isAuth,role.validateRole(["admin","manager","user"]),techpackController.process);
route.get('/techpack/detail/:id',isAuth,techpackController.detail);

//,role.validateRole(["admin","manager","user","supplier"])
route.post('/techpack/process_first',isAuth,role.validateRole(["admin","manager","user","supplier"]),techpackController.store_process);
route.post('/techpack_process/delete/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),techpackController.delete_process);
route.post('/techpack_process/update/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),techpackController.update_process);
route.get('/techpack_process/update/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),techpackController.edit_process);
route.post('/techpack_process/alldone',isAuth,role.validateRole(["admin","manager","user","supplier"]),techpackController.process_all_done);

route.post('/notify/click',isAuth,notifyController.updateNotify);

//category
route.get('/category/create',isAuth ,role.validateRole(["admin","manager","user","supplier"]),categoryController.create);
route.post('/category/update/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),categoryController.update);
route.get('/category/edit/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),categoryController.edit);
route.get('/category/detail/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),categoryController.sub);
route.post('/category/delete/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),categoryController.delete);
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
,isAuth,role.validateRole(["admin","manager","user","supplier"]),categoryController.store);

//,role.validateRole(["admin","manager","user"])
route.post('/category/sublist',
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
,isAuth, role.validateRole(["admin","manager","user"]),categoryController.store_sub);
route.post('/category/delete_sub/:id',isAuth,role.validateRole(["admin","manager","user"]),categoryController.delete_sub);
route.get('/category/edit_sub/:id',isAuth,role.validateRole(["admin","manager","user"]),categoryController.edit_sub);
route.post('/category/update_sub/:id',isAuth,role.validateRole(["admin","manager","user"]),categoryController.update_sub);
route.post('/category/getchild',isAuth,role.validateRole(["admin","manager","user"]),categoryController.getchild);

route.get('/category', isAuth,role.validateRole(["admin","manager","user"]), categoryController.index);

//cloth
route.get('/cloth/create',isAuth,role.validateRole(["admin","manager","user","supplier"]) ,clothController.create);
route.post('/cloth/update/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),clothController.update);
route.get('/cloth/edit/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),clothController.edit);
route.post('/cloth/delete/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),clothController.delete);
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
,isAuth,role.validateRole(["admin","manager","user","supplier"]) ,clothController.store);
route.get('/cloth', isAuth,role.validateRole(["admin","manager","user","supplier"]), clothController.index);

//type
route.get('/type/create',isAuth,role.validateRole(["admin","manager","user","supplier"]) ,typeController.create);
route.post('/type/update/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),typeController.update);
route.get('/type/edit/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),typeController.edit);
route.post('/type/delete/:id',isAuth,role.validateRole(["admin","manager","user","supplier"]),typeController.delete);
route.post('/type/store',
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
,isAuth,role.validateRole(["admin","manager","user","supplier"]),typeController.store);
route.get('/type', isAuth,role.validateRole(["admin","manager","user","supplier"]), typeController.index);
route.post('/api/type/getchild',isAuth,role.validateRole(["admin","manager","user","supplier"]),typeController.getchild);
//Invoice
route.get('/invoice/create',isAuth ,role.validateRole(["admin","manager","hr"]),invoiceController.create);
route.post('/invoice/update/:id',isAuth,role.validateRole(["admin","manager","hr"]),invoiceController.update);
route.get('/invoice/edit/:id',isAuth,role.validateRole(["admin","manager","hr"]),invoiceController.edit);
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
,isAuth,role.validateRole(["admin","manager","hr"]) ,invoiceController.store);
route.get('/invoice/store_of_edit/:id',isAuth,role.validateRole(["admin","manager","hr"]),invoiceController.store_of_edit);
route.post('/invoice/item',isAuth,role.validateRole(["admin","manager","hr"]),  invoiceController.additem);
route.post('/invoice/item/delete/:id',isAuth,role.validateRole(["admin","manager","hr"]),  invoiceController.delete_item);
route.get('/invoice/item/update/:id',isAuth,role.validateRole(["admin","manager","hr"]),  invoiceController.item_update);
route.post('/invoice/item/update/:id',isAuth,role.validateRole(["admin","manager","hr"]),  invoiceController.item_update_store);

route.get('/invoice', isAuth ,role.validateRole(["admin","manager","hr"]), invoiceController.index);

//Warehouse
route.get('/warehouse/create',isAuth ,role.validateRole(["admin","manager","user","hr"]),warehouseController.create);
route.post('/warehouse/update/:id',isAuth,role.validateRole(["admin","manager","user","hr"]),warehouseController.update);
route.get('/warehouse/edit/:id',isAuth,role.validateRole(["admin","manager","user","hr"]),warehouseController.edit);
route.post('/warehouse/delete/:id',isAuth,role.validateRole(["admin","manager","user","hr"]),warehouseController.delete);
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
,isAuth,role.validateRole(["admin","manager","user","hr"]) ,warehouseController.store);
route.get('/warehouse', isAuth,role.validateRole(["admin","manager","user","hr"]), warehouseController.index);

route.get('/warehouse/detail/:id',isAuth,role.validateRole(["admin","manager","user","hr"]),warehouseController.detail);

//History
route.get('/history', isAuth, role.validateRole(["admin","manager"]), historyController.index);

//User Routes

//Home Page routes
route.get('/',homeController.welcome);


module.exports = route;