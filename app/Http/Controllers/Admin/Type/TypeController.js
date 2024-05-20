const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged


exports.getchild = async (req, resp, next) => {
    await db.Type.findAll({
        where: {
            typeOf: req.body.typeOf
        }
    })
    .then((result) => {
            console.log('-------',result);
            historyLogged(req.session.username,'getchild',LogConstant.SUCCESS);
            return resp.status(200).json({
                status: 200,
                result
            });       
    })
    .catch(error => {
        throw new Error(error);
    });
} 

exports.index = async (req, resp, next) => {
    await db.Type.findAll()
    .then((result) => {
        console.log('Type Controller',result);
        resp.render('dashboard/admin/type/index',{
            typeList: result,
            pageTitle: 'Type'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 

exports.create = (req, resp, next) =>{
    resp.render('dashboard/admin/type/create',{
        pageTitle: 'Type'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let type = await db.Type.findAll()
                .then( (type) =>{
                    return type;
                });
    await db.Type.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/type/edit',{
            type: result,
            typeList: type,
            pageTitle: 'Type'
        });  
    })
    .catch((error) => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.Type.create(req.body)
    .then((result) => {
        historyLogged(req.session.username,'create type',LogConstant.SUCCESS,item=result.id);
       
        req.flash('success', `New Type added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/type');
    })
    .catch((error) => {
        historyLogged(req.session.username,'create type',LogConstant.FAILED,error.message);
        throw new Error(error);
    });
}

exports.update = (req, resp, next) =>{
    db.Type.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {       
        historyLogged(req.session.username,'update cloth type',LogConstant.SUCCESS,req.params.id);
        
        req.flash('success', `Cloth updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/type');
    })
    .catch(error => {
        historyLogged(req.session.username,'update type',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.Type.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {      
        historyLogged(req.session.username,'delete cloth type',LogConstant.SUCCESS,req.params.id);
        
        req.flash('warning', `Type deleted successfully!`);        
        resp.status(200).redirect('/type');
        
    })
    .catch(error => {
        historyLogged(req.session.username,'delete type type',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}