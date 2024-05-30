const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged

exports.index = async (req, resp, next) => {
    await db.Role.findAll()
    .then((result) => {
        resp.render('dashboard/admin/role/index',{
            roleList: result,
            pageTitle: 'Roles'
        });        
    })
    .catch(error => {
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });
} 

exports.create = (req, resp, next) =>{
    resp.render('dashboard/admin/role/create',{
        pageTitle: 'Roles'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let roles = await db.Role.findAll()
                .then( (roles) =>{
                    return roles;
                });
    await db.Role.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/role/edit',{
            role: result,
            roleList: roles,
            pageTitle: 'Roles'
        });  
    })
    .catch((error) => {
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });
}

exports.store = (req, resp, next) =>{
    db.Role.create(req.body)
    .then((result) => {
        historyLogged(req.session.username,'create role',LogConstant.SUCCESS,item=result.id);
        req.flash('success', `New Role added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/roles');
    })
    .catch((error) => {
        historyLogged(req.session.username,'create role',LogConstant.FAILED,error.message);
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });
}

exports.update = (req, resp, next) =>{
    db.Role.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {
        historyLogged(req.session.username,'create role',LogConstant.SUCCESS,req.params.id);
                
        req.flash('success', `Role updated successfully!`)
        resp.status(200).redirect('/roles');
    })
    .catch(error => {
        historyLogged(req.session.username,'update role',LogConstant.FAILED,error.message);
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    })
}

exports.delete = async (req, resp, next) =>{
    await db.Role.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {
        historyLogged(req.session.username,'delete role',LogConstant.SUCCESS,req.params.id);
             
        req.flash('warning', `Role deleted successfully!`);        
        resp.status(200).redirect('/roles');
    })
    .catch(error => {
        historyLogged(req.session.username,'update role',LogConstant.FAILED,error.message);
        
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    })
}