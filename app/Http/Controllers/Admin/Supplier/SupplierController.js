const db = require('../../../../../models');
const { validationResult } = require('express-validator');

exports.index = async (req, resp, next) => {
    await db.TechpackStock.findAll()
    .then((result) => {
        console.log('TechpackStock Controller',result);
        resp.render('dashboard/admin/supplier/index',{
            supplierList: result,
            pageTitle: 'Supplier'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 

exports.create = (req, resp, next) =>{
    resp.render('dashboard/admin/supplier/create',{
        pageTitle: 'Supplier'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let suppliers = await db.TechpackStock.findAll()
                .then( (suppliers) =>{
                    return suppliers;
                });
    await db.TechpackStock.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/supplier/edit',{
            supplier: result,
            supplierList: suppliers,
            pageTitle: 'Supplier'
        });  
    })
    .catch((error) => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.TechpackStock.create(req.body)
    .then(() => {
        req.flash('success', `New Supplier added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/supplier');
    })
    .catch((error) => {
        throw new Error(error);
    });
}

exports.update = (req, resp, next) =>{
    db.TechpackStock.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {        
        req.flash('success', `Supplier updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/supplier');
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.TechpackStock.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {      
        req.flash('warning', `Supplier deleted successfully!`);        
        resp.status(200).redirect('/supplier');
    })
    .catch(error => {
        throw new Error(error);
    })
}