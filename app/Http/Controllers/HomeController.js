const db = require('../../../models');

exports.home = async (req, resp, next) => {

    const countDisable = await db.User.count({
        where: {
            status: 0
        }
    });
    const countItem = await db.Techpack.count({
        where: {
            status: 3
        }
    });
    const countItem_processing = await db.Techpack.count({
        where:
         { 
            status : {
                [db.Sequelize.Op.and]: [
                    { [db.Sequelize.Op.lt]: 3 } // status < 3
                ]
            }
            
        }
    });
    const countActive = await db.User.count({
        where: {
            status: 1
        }
    });
    const countInvoiceNoDone = await db.Invoice.count({
        where: {
            status: {
                [db.Sequelize.Op.notIn]:  ['Done', 'Cancel'],  
            }
        }
    });
    const countInvoice = await db.Invoice.count({
        where: {
            status: {
                [db.Sequelize.Op.not]:  'Cancel'
            }
        }
    });

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
    const sum_invoice = await db.Invoice.sum('total', {
        where : {
            status : 'Done'
        }
    });
    const total_invoice = await db.Invoice.sum('total');

    let processList = await db.TechpackProcess.findAll({
        attributes: ['id', 'groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
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

    return resp.render('dashboard/layout/index', {
        notification,
        countDisable,
        countActive,
        countItem,
        countInvoice,
        countInvoiceNoDone,
        countItem_processing,
        sum_invoice,
        total_invoice,
        count_notification,
        process: processList,
    });
}

exports.welcome = (req, resp, next) => {
    return resp.render('front-end/layout/index')
}