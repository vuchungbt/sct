const db = require('../../../../../models');
const { validationResult } = require('express-validator');

exports.index = async (req, resp, next) => {
    await db.Techpack.findAll( {
        where: {
            status: {
                [db.Sequelize.Op.eq]: 3,
            }
        },
        include: [
            {
                model: db.TechpackCategory,
                as: 'category'
            },
            {
                model: db.TechpackSubCategory,
                as: 'sub_category'
            }]
    })
    .then((result) => {
        console.log('Warehouse Controller',result);
        resp.render('dashboard/admin/warehouse/index',{
            techpackList: result,
            pageTitle: 'Warehouse'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 
exports.detail = async (req, resp, next) => {
    await db.Techpack.findByPk(req.params.id, {
        include: [
            {
                model: db.TechpackCategory,
                as: 'category'
            },
            {
                model: db.TechpackSubCategory,
                as: 'sub_category'
            },
            {
                model: db.TechpackCloth,
                as: 'cloth'
            },
            {
                model: db.User,
                as: 'createby'
            },
            {
                model: db.User,
                as: 'confirmby'
            },
            {
                model: db.TechpackHistory,
                as: 'history'
            }
        ]
    })
        .then((result) => {
            resp.render('dashboard/admin/warehouse/detail', {
                history:result.history,
                techpack: result,
                pageTitle: 'Warehouse'
            });
        })
        .catch((error) => {
           // historyLogged(req.session.username,'load item',LogConstant.FAILED,error.message );
            throw new Error(error);
        });
}

exports.create = (req, resp, next) =>{
    resp.render('dashboard/admin/warehouse/create',{
        pageTitle: 'Warehouse'
        
    });
}

exports.edit = async (req, resp, next) =>{
    let warehouses = await db.Warehouse.findAll()
                .then( (warehouses) =>{
                    return warehouses;
                });
    await db.Wrehouse.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/warehouse/edit',{
            warehouse: result,
            warehouseList: warehouses,
            pageTitle: 'Warehouse'
        });  
    })
    .catch(() => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.Warehouse.create(req.body)
    .then(() => {
        req.flash('success', `New Warehouse added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/warehouse');
    })
    .catch((error) => {
        throw new Error(error);
    });
}

exports.update = (req, resp, next) =>{
    db.Warehouse.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {        
        req.flash('success', `Warehouse updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/warehouse');
    })
    .catch(error => {
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.Warehouse.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {      
        req.flash('warning', `Warehouse deleted successfully!`);        
        resp.status(200).redirect('/warehouse');
    })
    .catch(error => {
        throw new Error(error);
    })
}