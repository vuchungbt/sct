const db = require('../../../../../models');
const { validationResult } = require('express-validator');

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
        throw new Error(error);
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
    .catch(() => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.TechpackCloth.create(req.body)
    .then(() => {
        req.flash('success', `New Cloth added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/cloth');
    })
    .catch(() => {
        throw new Error(error);
    });
}

exports.update = (req, resp, next) =>{
    db.TechpackCloth.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {        
        req.flash('success', `Cloth updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/cloth');
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.TechpackCloth.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {      
        req.flash('warning', `Cloth deleted successfully!`);        
        resp.status(200).redirect('/cloth');
        
    })
    .catch(error => {
        throw new Error(error);
    })
}