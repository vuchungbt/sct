const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged

exports.index = async (req, resp, next) => {
    await db.TechpackStock.findAll()
        .then((result) => {
            console.log('TechpackStock Controller', result);
            resp.render('dashboard/admin/supplier/index', {
                supplierList: result,
                pageTitle: 'Supplier'
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
    let rs = await db.User.findAll({
        where: {
            roleId: 4
        }
    }).then((rs) => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', rs)
        resp.render('dashboard/admin/supplier/create', {
            pageTitle: 'Supplier',
            userList: rs
        });
    })

}

exports.edit = async (req, resp, next) => {
    let suppliers = await db.TechpackStock.findAll()
        .then((suppliers) => {
            return suppliers;
        });
    await db.TechpackStock.findByPk(req.params.id)
        .then((result) => {
            resp.render('dashboard/admin/supplier/edit', {
                supplier: result,
                supplierList: suppliers,
                pageTitle: 'Supplier'
            });
        })
        .catch((error) => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}

exports.store = (req, resp, next) => {
    db.TechpackStock.create(req.body)
        .then((result) => {
            historyLogged(req.session.username, 'create supplier', LogConstant.SUCCESS, item = result.id);

            req.flash('success', `New Supplier added ${req.body.name} successfully!`);
            resp.status(200).redirect('/supplier');
        })
        .catch((error) => {
            historyLogged(req.session.username, 'create supplier', LogConstant.FAILED, error.message);

            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}

exports.update = (req, resp, next) => {
    const route = req.body.route;
    db.TechpackStock.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            historyLogged(req.session.username, 'update supplier', LogConstant.SUCCESS, req.params.id);
            if(route=='store') {
                req.flash('success', `Stock updated ${req.body.name} successfully!`)
                resp.status(200).redirect('/stock/store');

            }
            else {
                req.flash('success', `Supplier updated ${req.body.name} successfully!`)
                resp.status(200).redirect('/supplier');

            }
        })
        .catch(error => {

            historyLogged(req.session.username, 'update supplier', LogConstant.FAILED, error.message);

            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}

exports.delete = async (req, resp, next) => {
    await db.TechpackStock.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            historyLogged(req.session.username, 'delete supplier', LogConstant.SUCCESS, req.params.id);

            req.flash('warning', `Supplier deleted successfully!`);
            resp.status(200).redirect('/supplier');
        })
        .catch(error => {
            historyLogged(req.session.username, 'delete supplier', LogConstant.FAILED, error.message);

            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        })
}

// -------------roles-----------------
exports.home = async (req, resp, next) => {

    const notification = await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id
        },
        limit: 6
    })
    const count_notification = await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id,
            status: 1
        },
        limit: 6
    });

    const my_store = await db.User.findByPk(id = req.session.user_id, {

        include:
        {
            model: db.TechpackStock,
            as: 'stocks',
            include: [
                {
                    model: db.Techpack,
                    as: 'techpack'
                },
                {
                    model: db.Invoice,
                    include:
                    {
                        model: db.User,
                        as: 'createdby'
                    }
                }
            ]
        }
    }).then(my_store => {
        return my_store;
    });


    const techpack = my_store.stocks.flatMap(st => st.techpack);

    const invoices = my_store.stocks.flatMap(st => st.Invoices);


    let count_not = 0;

    const techpackID = techpack.map(tp => tp.id);

    let processList = await db.TechpackProcess.findAll({
        attributes: ['id', 'groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
        where: {
            techpackId: {
                [db.Sequelize.Op.or]: techpackID
            }
        },
        include: [{
            model: db.Techpack,
            as:'techpackDetail'
        },
        {
            model: db.Type
        }
        ]

    }).then((processList) => {
        return processList;
    });
    if(techpackID.length==0) {
        processList = [];
    }

    const not_start = processList.filter(pr => pr.status == 0);
    count_not = not_start.length;
    return resp.render('dashboard/layout/stock', {
        my_store,
        process: processList,
        invoices,
        count_not,
        notification,
        count_notification
    });
}


exports.edit_process = async (req, resp, next) => {
    let process = await db.TechpackProcess.findOne({
        attributes: ['id', 'groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
        where: {
            id: req.params.id
        },
        include:
        {
            model: db.TechpackStock,
            as: 'stockprocess'
        }
    });
    let typeList = await db.Type.findAll({
        where: {
            typeOf: process.stockprocess.type
        }
    });

    resp.render('dashboard/admin/supplier/process_edit', {
        process,
        typeList,
        pageTitle: 'Techpack Process Edit'
    });
}

exports.techpack_view = async (req, resp, next) => {
    console.log('techpack_stock/view');
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
            }
        ]
    })
        .then((result) => {
            console.log('techpack_stock/view',result);
            resp.render('dashboard/admin/supplier/detail_small', {
                techpack: result,
                pageTitle: 'Techpack'
            });
        })
        .catch((error) => {
            historyLogged(req.session.username, 'load techpack', LogConstant.FAILED, error.message);
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}
exports.type = async (req, resp, next) => {
    await db.Type.findAll({
        where :{
            typeOf: 'garment_factory'
        }
    })
    .then((result) => {
        console.log('Type Controller',result);
        resp.render('dashboard/admin/supplier/type',{
            typeList: result,
            pageTitle: 'Type'
        });        
    })
    .catch(error => {
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });
} 
exports.item = async (req, resp, next)=>{
    const my_store = await db.User.findByPk(id = req.session.user_id, {

        include:
        {
            model: db.TechpackStock,
            as: 'stocks',
            include: [
                {
                    model: db.Techpack,
                    as: 'techpack',
                    include : [
                        {
                            model: db.TechpackCategory,
                            as: 'category'
                        },
                        {
                            model: db.TechpackSubCategory,
                            as: 'sub_category'
                        }
                    ]
                },
                {
                    model: db.Invoice,
                    include:
                    {
                        model: db.User,
                        as: 'createdby'
                    }
                }
            ]
        }
    }).then(my_store => {
        return my_store;
    });


    const techpack = my_store.stocks.flatMap(st => st.techpack);
    
    const uniqueTps = [];
    const tpIds = new Set();
    
    for (const tp of techpack) {
      if (!tpIds.has(tp.id)) {
        uniqueTps.push(tp);
        tpIds.add(tp.id);
      }
    }


    const invoices = my_store.stocks.flatMap(st => st.Invoices);

    resp.render('dashboard/admin/supplier/item_techpack',{
                techpackList: uniqueTps,
                userId: req.session.user_id,
                pageTitle: 'Techpack'
    }); 
}
exports.addprocess = async (req, resp, next) => { 

    let suppliers = await db.TechpackStock.findAll({
        where: {
            type :{
                [db.Sequelize.Op.or]: ['embroidery_factory','print_factory']
            }
        } 
        
    }).then((suppliers) => {
        return suppliers;
    });

    let processList = await db.TechpackProcess.findAll({
        attributes: ['id', 'groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
        where: {
            techpackId: req.params.id,
        },
        include:
            [{
                model: db.TechpackStock,
                as: 'stockprocess'
            },
            {
                model: db.Type

            }]
    }).then((processList) => {
        return processList;
    });
    await db.Techpack.findByPk(req.params.id)
        .then((result) => {

            const groupedTP = processList.reduce((acc, user) => {
                if (!acc[user.groupID]) {
                    acc[user.groupID] = [];
                }
                acc[user.groupID].push(user);
                return acc;
            }, {});

            const groups = Object.values(groupedTP);

            console.log('$$$$$$$$$$$$$$', groups)

            resp.render('dashboard/admin/supplier/addprocess', {
                supplierList: suppliers,
                techpack: result,
                processList,
                groups,
                pageTitle: 'process'
            });
        })
        .catch((error) => {
            historyLogged(req.session.username, 'load techpack', LogConstant.FAILED, error.message);
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });

}
exports.process = async (req, resp, next) => {
    const my_store = await db.User.findByPk(id = req.session.user_id, {

        include:
        {
            model: db.TechpackStock,
            as: 'stocks',
            include: [
                {
                    model: db.Techpack,
                    as: 'techpack'
                },
                {
                    model: db.Invoice,
                    include:
                    {
                        model: db.User,
                        as: 'createdby'
                    }
                }
            ]
        }
    }).then(my_store => {
        return my_store;
    });
    const techpack = my_store.stocks.flatMap(st => st.techpack);
    const techpackID = techpack.map(tp => tp.id);
    let processList = await db.TechpackProcess.findAll({
        attributes: ['id', 'groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
        where: {
            techpackId: {
                [db.Sequelize.Op.or]: techpackID
            }
        },
        include: [{
            model: db.Techpack,
            as:'techpackDetail'
        },
        {
            model: db.Type
        }
        ]

    }).then((processList) => {
        return processList;
    });
    return resp.render('dashboard/admin/supplier/process', {
        process: processList
    });

}
exports.mystore = async (req, resp, next) => {
    const my_store = await db.User.findByPk(id = req.session.user_id, {

        include:
        {
            model: db.TechpackStock,
            as: 'stocks',
            // include: [
            //     {
            //         model: db.Techpack,
            //         as: 'techpack'
            //     },
            //     {
            //         model: db.Invoice,
            //         include:
            //         {
            //             model: db.User,
            //             as: 'createdby'
            //         }
            //     }
            // ]
        }
    }).then(my_store => {
        return my_store;
    });

    resp.render('dashboard/admin/supplier/store', {
        supplierList: my_store.stocks,
        pageTitle: 'Supplier'
    });
}


exports.edit_store = async (req, resp, next) => {
    let suppliers = await db.TechpackStock.findAll()
        .then((suppliers) => {
            return suppliers;
        });
    await db.TechpackStock.findByPk(req.params.id)
        .then((result) => {
            resp.render('dashboard/admin/supplier/store_edit', {
                supplier: result,
                supplierList: suppliers,
                pageTitle: 'Supplier'
            });
        })
        .catch((error) => {
            return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
        });
}


exports.invoice = async (req, resp, next) => {
    const my_store = await db.User.findByPk(id = req.session.user_id, {

        include:
        {
            model: db.TechpackStock,
            as: 'stocks',
            include: [
                {
                    model: db.Techpack,
                    as: 'techpack'
                },
                {
                    model: db.Invoice,
                    include:
                    {
                        model: db.User,
                        as: 'createdby'
                    }
                }
            ]
        }
    }).then(my_store => {
        return my_store;
    });
    const invoices = my_store.stocks.flatMap(st => st.Invoices);

    return resp.render('dashboard/admin/supplier/invoice', {
        invoices: invoices
    });

}

exports.invoice_detail = async (req, resp, next) => {
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
        resp.render('dashboard/admin/supplier/invoice_detail', {
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