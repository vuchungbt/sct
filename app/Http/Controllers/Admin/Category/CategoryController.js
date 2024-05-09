const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged
const pushNotify = require("../../../Helper/NotifyController").store ;

exports.getchild = async (req, resp, next) => {
    await db.TechpackSubCategory.findAll({
        where: {
            categoryId: req.body.categoryId
        }
    })
    .then((result) => {
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

exports.sub = async (req, resp, next) =>{
    await db.TechpackCategory.findByPk(req.params.id,
        {
            include: {
            model: db.TechpackSubCategory,
            as: 'sub_category'
        }} )
    .then((result) => {
        console.log('Sub-cate**************************',result);
        resp.render('dashboard/admin/category/detail',{
            category: result,
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
        //pushNotify(req.session.user_id,result.id,'category has been created',type='category',req,resp,next) ;
            
        req.flash('success', `New Category added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/category');
    })
    .catch((error) => {
        historyLogged(req.session.username,'create category',LogConstant.FAILED,error.message);
        throw new Error(error.message);
    });
}
exports.edit_sub = async (req, resp, next) =>{
    await db.TechpackSubCategory.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/category/edit_sub',{
            sub_category: result,
            pageTitle: 'Sub-Category'
        });  
    })
    .catch((error) => {
        throw new Error(error);
    });
}
exports.store_sub = (req, resp, next) =>{
    console.log(req.body);
    db.TechpackSubCategory.create(req.body)
    .then((result) => {
        historyLogged(req.session.username,'create sub category',LogConstant.SUCCESS,item=result.id);
       
        req.flash('success', `New Sub Category added ${ req.body.name } of CategoryID ${ req.body.categoryId } successfully!`);
        resp.status(200).redirect('/category/detail/'+req.body.categoryId);
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
        //pushNotify(req.session.user_id,req.params.id,'category has been updated','category',req,resp,next) ;
            
        req.flash('success', `Category updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/category');
    })
    .catch(error => {
        historyLogged(req.session.username,'update category',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.TechpackSubCategory.destroy({
        where: {
            categoryId: req.params.id
        }
    });
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
        historyLogged(req.session.username,'delete category',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}
exports.update_sub = (req, resp, next) =>{
    db.TechpackSubCategory.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {        
        historyLogged(req.session.username,'update sub category',LogConstant.SUCCESS,req.params.id);
       
        req.flash('success', `Category updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/category/edit_sub/'+req.params.id);
    })
    .catch(error => {
        historyLogged(req.session.username,'update category',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}

exports.delete_sub = async (req, resp, next) =>{
    await db.TechpackCategory.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {   
        historyLogged(req.session.username,'delete sub category',LogConstant.SUCCESS,req.params.id);
           
        req.flash('warning', `Sub-Category deleted successfully!`);        
        resp.status(200).redirect('/category');
    })
    .catch(error => {
        historyLogged(req.session.username,'Sub-category delete',LogConstant.FAILED,error.message);
        
        throw new Error(error);
    })
}