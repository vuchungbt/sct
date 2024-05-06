const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged

exports.index = async (req, resp, next) => {
    await db.TechpackCategory.findAll()
    .then((result) => {
        console.log('Category Controller',result);
        resp.render('dashboard/admin/category/index',{
            categoryList: result,
            pageTitle: 'Category'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 

exports.create = (req, resp, next) =>{
    resp.render('dashboard/admin/category/create',{
        pageTitle: 'Category'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let category = await db.TechpackCategory.findAll()
                .then( (category) =>{
                    return category;
                });
    await db.TechpackCategory.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/category/edit',{
            category: result,
            categoryList: category,
            pageTitle: 'Category'
        });  
    })
    .catch((error) => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.TechpackCategory.create(req.body)
    .then((result) => {
        historyLogged(req.session.username,'create category',LogConstant.SUCCESS,item=result.id);
       
        req.flash('success', `New Category added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/category');
    })
    .catch((error) => {
        historyLogged(req.session.username,'create category',LogConstant.FAILED,error.message);
        throw new Error(error.message);
    });
}

exports.update = (req, resp, next) =>{
    db.TechpackCategory.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {        
        historyLogged(req.session.username,'update category',LogConstant.SUCCESS,req.params.id);
       
        req.flash('success', `Category updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/category');
    })
    .catch(error => {
        historyLogged(req.session.username,'update category',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.TechpackCategory.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {   
        historyLogged(req.session.username,'delete category',LogConstant.SUCCESS,req.params.id);
           
        req.flash('warning', `Category deleted successfully!`);        
        resp.status(200).redirect('/category');
    })
    .catch(error => {
        historyLogged(req.session.username,'update category',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}