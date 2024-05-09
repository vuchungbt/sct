const db = require('../../../models');

exports.home = async (req, resp, next) =>{
    const  notification = await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id
        },
        limit : 15
    }) 
    const  count_notification = await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id,
            status:1
        },
        limit : 15
    });

    return resp.render('dashboard/layout/index',{
        notification,
        count_notification
    });
}

exports.welcome = (req, resp, next) => {
   return resp.render('front-end/layout/index')
}