const db = require('../../../../../models');
const roles = require('../../../Helper/UserRolesHelperFunctions');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged

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
exports.resetinfo = async (req, res, next) => { 
    await db.User.findByPk(req.params.id)
        .then((result) => {           
            // .then( (roles,result) =>{
                res.render('dashboard/admin/user/resetpw',{
                pageTitle: "Reset password",
                errorMessage: null,
                user: result
            // });    
            });
    })
    .catch(err => {
        return res.status(400).json({
            status:400,
            msg : 'Fill required value to all fields'
        })
    }); 
}

exports.updatepw_info = async (req, res, next) => { 
    res.render('dashboard/admin/user/changepw',{
        pageTitle: "Reset password"
    // });    
    });
}
exports.changeinfo = async (req, res, next) => { 
    await db.User.findByPk(req.params.id)
        .then((result) => {           
            // .then( (roles,result) =>{
                res.render('dashboard/admin/user/changeinfo',{
                pageTitle: "Reset password",
                errorMessage: null,
                user: result
            // });    
            });
    })
    .catch(err => {
        throw new Error(err);
    }); 
}
exports.resetpw = async (req,res,next) => {
     await bcrypt.hash(req.body.password,12)
    .then(passwordHash => { 
        
        db.User.update( {'password': passwordHash},{
            where: {
                id: req.params.id
            }
        })
        .then((result) => {
            historyLogged(req.session.username,'reset password',LogConstant.SUCCESS ,req.params.id);
           
            req.flash('success', `Reset password successfully!`);
            res.status(200).redirect('/users');
        })
        .catch(error =>{
            historyLogged(req.session.username,'reset password',LogConstant.FAILED,error.message );
          
            return res.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        }); 
    })
       
}
exports.updatepw = async (req,res,next) => {

    

    await bcrypt.hash(req.body.password,12)
   .then(passwordHash => { 
       
       db.User.update( {'password': passwordHash},{
           where: {
               id: req.params.id
           }
       })
       .then((result) => {
           historyLogged(req.session.username,'reset password',LogConstant.SUCCESS ,req.params.id);
          
           req.flash('success', `Reset password successfully!`);
           res.status(200).redirect('/users');
       })
       .catch(error =>{
           historyLogged(req.session.username,'reset password',LogConstant.FAILED,error.message );
         
           return res.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
       }); 
   })
      
}
exports.edit = async (req, res, next) => {
    let roles = await db.Role.findAll()
                .then( (roles) =>{
                    return roles;
                });
    await db.User.findByPk(req.params.id,{
        include: {
          model: db.Role,
          as : 'role'
        }
      })
        .then((result) => {           
            // .then( (roles,result) =>{
                res.render('dashboard/admin/user/edit',{
                pageTitle: "Add User",
                errorMessage: null,
                user: result,
                role: result.role.name,
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
        .then((result) => {  
            historyLogged(req.session.username,'add user',LogConstant.SUCCESS ,result.id);
            
            req.flash('success', `New User added ${ req.body.name } successfully!`);
            res.status(200).redirect('/users');
    
        })
        .catch(error => {
            historyLogged(req.session.username,'add user',LogConstant.FAILED,error.message );
          
            return res.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });       
    })
    .catch((error) => {
        historyLogged(req.session.username,'add user',LogConstant.FAILED,error.message );
          
        return res.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    }); 

}

exports.update = (req,res,next) => {
    const isChange = req.body.isChange;
    db.User.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then((result) => {
        historyLogged(req.session.username,'update user',LogConstant.SUCCESS ,req.params.id);
        if(isChange==1) {
            req.flash('success', `User update ${ req.body.name } successfully!`);
            res.status(200).redirect('/superuser/changeinfo/'+req.params.id);
            
        }   else {

            req.flash('success', `User update ${ req.body.name } successfully!`);
            res.status(200).redirect('/users'); 
        }
        
    })
    .catch(error =>{
        historyLogged(req.session.username,'update user',LogConstant.FAILED,error.message );
          
        return res.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });    
}

exports.delete = (req,res,next) => {
    db.User.destroy({
        where:{
            id: req.params.id
        }    
    })
    .then(() => {
        historyLogged(req.session.username,'delete user',LogConstant.SUCCESS ,req.params.id);
        
        req.flash('success', `User deleted successfully!`);
        res.status(200).redirect('/users');
    })
    .catch(error => {
        historyLogged(req.session.username,'delete user',LogConstant.FAILED,error.message );
          
        return res.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    }); 
}

