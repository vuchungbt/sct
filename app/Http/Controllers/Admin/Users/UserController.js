const db = require('../../../../../models');
const roles = require('../../../Helper/UserRolesHelperFunctions');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.index = async (req,res,next) => {  
    // console.log(await roles.usersByRoles());
    try {
        res.render('dashboard/admin/user/index',{
            users:  await roles.usersByRoles(),
            pageTitle: "Home Page"
        });
    } catch (error) {
        return next(error);
    } 
}

exports.create = async (req, res, next) => {
    //res.sendFile(path.join(__dirname,'../','views','user','create.html'));   
    await db.Role.findAll()
        .then( (roles) =>{
            return roles;
        })
        .then( (roles) =>{
            console.log('>>> dashboard/admin/user/create',roles);
            res.render('dashboard/admin/user/create',{
            pageTitle: "Add User",
            errorMessage: null,
            roleList: roles
        });    
    });
}

exports.edit = async (req, res, next) => {
    let roles = await db.Role.findAll()
                .then( (roles) =>{
                    return roles;
                });
    await db.User.findByPk(req.params.id,{
        include: {
          model: db.Role
        }
      })
        .then((result) => {           
            // .then( (roles,result) =>{
                res.render('dashboard/admin/user/edit',{
                pageTitle: "Add User",
                errorMessage: null,
                user: result,
                role: result.Role.name,
                roleList: roles
            // });    
            });
    })
    .catch(err => {
        throw new Error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });   
}

exports.store = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('dashboard/admin/user/create',{
            pageTitle: "Add User",
            errorMessage: errors.array(),
            roles:  await db.Role.findAll()
        });
    }

    await bcrypt.hash(req.body.password,12)
    .then(passwordHash => {
        db.User.create({
            name: req.body.name,
            tel: req.body.tel,
            status: req.body.status,
            email: req.body.email,
            password: passwordHash,
            roleId: req.body.role
        })
        .then((user) => {  
    
            req.flash('success', `New User added ${ req.body.name } successfully!`);
            res.status(200).redirect('/users');
    
        })
        .catch(error => {
            throw new Error(error);
        });       
    })
    .catch((err) => {
        throw new Error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }); 

}

exports.update = (req,res,next) => {
    db.User.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then((result) => {
        req.flash('success', `User update ${ req.body.name } successfully!`);
        res.status(200).redirect('/users');
    })
    .catch(err =>{
        throw new Error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });    
}

exports.delete = (req,res,next) => {
    db.User.destroy({
        where:{
            id: req.params.id
        }    
    })
    .then(() => {
        req.flash('success', `User deleted successfully!`);
        res.status(200).redirect('/users');
    })
    .catch(err => {
        throw new Error(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }); 
}

