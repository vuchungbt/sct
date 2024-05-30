const db = require('../../../../../models');
const { validationResult } = require('express-validator');

exports.index = async (req, resp, next) => {

    await db.Invoice.findAll({
        include: [
            {
                model: db.User,
                as: 'createdby'
            },
            {
                model: db.TechpackStock,
                as: 'supplier'
            }]
    })
        .then((result) => {
            console.log('Invoice Controller', result);
            resp.render('dashboard/admin/invoice/index', {
                invoiceList: result,
                pageTitle: 'Invoice'
            });
        })
        .catch(error => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}

exports.create = async (req, resp, next) => {
    let suppliers = await db.TechpackStock.findAll()
        .then((suppliers) => {
            return suppliers;
        });
    resp.render('dashboard/admin/invoice/create', {

        supplierList: suppliers,
        pageTitle: 'Invoice'

    });
}

exports.edit = async (req, resp, next) => {
    let supplierList = await db.TechpackStock.findAll()
        .then((supplierList) => {
            return supplierList;
        });

    let details = await db.InvoiceDeltail.findAll( {
        attributes: ['id', 'price','quantity','type'],
        where :{
            invoiceId : req.params.id
        },
        include : {
            model: db.Techpack,
            as:'techpack'
        }
    })
        .then((supplierList) => {
            return supplierList;
        });
    await db.Invoice.findByPk(req.params.id, {
        include: [
            {
                model: db.InvoiceDeltail,
                as: 'detail'
            },
            {
                model: db.User,
                as: 'createdby'
            },
            {
                model: db.Techpack,
                as: 'techpacks'
            },
            {
                model: db.TechpackStock,
                as: 'supplier'
            }]

    })
        .then((result) => {
            console.log('>>===========result.details---------\n', details);
            resp.render('dashboard/admin/invoice/edit', {
                invoice: result,
                supplierList,
                details,
                pageTitle: 'Invoice'
            });
        })
        .catch((error) => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}

exports.store = async (req, resp, next) => {
    let techpack = await db.Techpack.findAll({
        where: {
            status: {
                [db.Sequelize.Op.and]: [
                    { [db.Sequelize.Op.gt]: 1 }, // status > 0
                    { [db.Sequelize.Op.lt]: 7 } // status < 4
                ]
            }
        }
    });
    req.body.createdById = req.session.user_id;
    db.Invoice.create(req.body)
        .then((result) => {

            resp.render('dashboard/admin/invoice/item', {
                invoiceId: result.id,
                techpackList: techpack,
                pageTitle: 'Invoice item'
            });
        })
        .catch((error) => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}

exports.store_of_edit = async (req, resp, next) => {
    let techpack = await db.Techpack.findAll({
        where: {
            status: {
                [db.Sequelize.Op.and]: [
                    { [db.Sequelize.Op.gt]: 0 }, // status > 0
                    { [db.Sequelize.Op.lt]: 4 } // status < 4
                ]
            }
        }
    });
    resp.render('dashboard/admin/invoice/item', {
        invoiceId: req.params.id,
        techpackList: techpack,
        pageTitle: 'Invoice item'
    });
}


exports.update = (req, resp, next) => {
    db.Invoice.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            req.flash('success', `Invoice updated ${req.body.name} successfully!`)
            resp.status(200).redirect('/invoice');
        })
        .catch(error => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}
exports.additem = async (req, resp, next) => {
    let techpack = await db.Techpack.findAll({
        where: {
            status: {
                [db.Sequelize.Op.and]: [
                    { [db.Sequelize.Op.gt]: 0 }, // status > 0
                    { [db.Sequelize.Op.lt]: 4 } // status < 4
                ]
            }
        }
    });
    await db.Techpack.update(req.body, {
        where: {
            id: req.body.techpackId
        }
    });
    db.InvoiceDeltail.create(req.body)
        .then(result => {
            console.log('<><><><><>', req.body.techpackId)
            resp.render('dashboard/admin/invoice/item', {
                invoiceId: req.body.invoiceId,
                techpackList: techpack,
                pageTitle: 'Invoice item'
            });
        })
        .catch(error => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}
exports.delete = async (req, resp, next) => {
    await db.InvoiceDeltail.destroy({
        where: {
            invoiceId: req.params.id
        }
    })
    await db.Invoice.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            req.flash('warning', `Invoice deleted successfully!`);
            resp.status(200).redirect('/invoice');
        })
        .catch(error => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}

exports.delete_item = async (req, resp, next) => {
    await db.InvoiceDeltail.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
            req.flash('warning', `Invoice deleted successfully!`);
            resp.status(200).redirect('/invoice/edit/'+req.body.invoiceId);
        })
        .catch(error => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}

exports.item_update = async (req, resp, next) => {

    await db.InvoiceDeltail.findOne({
        where :{id:req.params.id},
        attributes: ['id','invoiceId', 'price','quantity','type'],
        
        include : {
            model: db.Techpack,
            as:'techpack'
        }
    }).then((result) => {
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',result)
            resp.render('dashboard/admin/invoice/item_edit', {
                detail: result,
                pageTitle: 'Invoice'
            });
        })
        .catch((error) => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}

exports.item_update_store = (req, resp, next) => {
    db.InvoiceDeltail.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            req.flash('success', `Invoice detail updated successfully!`)
            resp.status(200).redirect('/invoice/edit/'+req.body.invoiceId);
        })
        .catch(error => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}