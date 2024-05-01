const db = require('../../../../../models');
const { validationResult } = require('express-validator');

exports.index = async (req, resp, next) => {
    await db.TechpackStock.findAll()
    .then((result) => {
        console.log('Invoice Controller',result);
        resp.render('dashboard/admin/invoice/index',{
            invoiceList: result,
            pageTitle: 'Invoice'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 

exports.create = (req, resp, next) =>{
    resp.render('dashboard/admin/invoice/create',{
        pageTitle: 'Invoice'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let invoices = await db.Invoice.findAll()
                .then( (invoices) =>{
                    return invoices;
                });
    await db.Invoice.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/invoice/edit',{
            invoice: result,
            invoiceList: invoices,
            pageTitle: 'Invoice'
        });  
    })
    .catch(() => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.Invoice.create(req.body)
    .then(() => {
        req.flash('success', `New Invoice added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/invoice');
    })
    .catch(() => {
        throw new Error(error);
    });
}

exports.update = (req, resp, next) =>{
    db.Invoice.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {        
        req.flash('success', `Invoice updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/invoice');
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.Invoice.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {      
        req.flash('warning', `Invoice deleted successfully!`);        
        resp.status(200).redirect('/invoice');
    })
    .catch(error => {
        throw new Error(error);
    })
}