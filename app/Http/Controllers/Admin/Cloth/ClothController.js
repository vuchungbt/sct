const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged

exports.index = async (req, resp, next) => {
    await db.TechpackCloth.findAll()
    .then((result) => {
        console.log('Cloth Controller',result);
        resp.render('dashboard/admin/cloth/index',{
            clothList: result,
            pageTitle: 'Cloth'
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
    resp.render('dashboard/admin/cloth/create',{
        pageTitle: 'Cloth'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let cloth = await db.TechpackCloth.findAll()
                .then( (cloth) =>{
                    return cloth;
                });
    await db.TechpackCloth.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/cloth/edit',{
            cloth: result,
            clothList: cloth,
            pageTitle: 'Cloth'
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
    db.TechpackCloth.create(req.body)
    .then((result) => {
        historyLogged(req.session.username,'create cloth type',LogConstant.SUCCESS,item=result.id);
       
        req.flash('success', `New Cloth added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/cloth');
    })
    .catch((error) => {
        historyLogged(req.session.username,'create cloth type',LogConstant.FAILED,error.message);
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });
}

exports.update = (req, resp, next) =>{
    db.TechpackCloth.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {       
        historyLogged(req.session.username,'update cloth type',LogConstant.SUCCESS,req.params.id);
        
        req.flash('success', `Cloth updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/cloth');
    })
    .catch(error => {
        historyLogged(req.session.username,'update cloth type',LogConstant.FAILED,error.message);
        
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    })
}

exports.delete = async (req, resp, next) =>{
    await db.TechpackCloth.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {      
        historyLogged(req.session.username,'delete cloth type',LogConstant.SUCCESS,req.params.id);
        
        req.flash('warning', `Cloth deleted successfully!`);        
        resp.status(200).redirect('/cloth');
        
    })
    .catch(error => {
        historyLogged(req.session.username,'delete cloth type',LogConstant.FAILED,error.message);
        
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    })
}