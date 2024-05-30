const db = require('../../../models');
const LogConstant = require("../Constant/log.constant");
const historyLogged = require("./HistoryLogged").historyLogged

exports.index = async function(req, resp, next){
    return await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id,
            status :1
        },
        limit : 6
    }) 
}

exports.store = (to,data,action,type,req, resp, next) =>{
    db.Notify.create({
        assignToId: to,
        status : 1 ,
        type,
        data,
        content : action
    })
    .then((result) => {
       
        return result;
    })
    .catch((error) => {
        historyLogged(req.session.username,'create notify',LogConstant.FAILED,error.message);
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    });
}

exports.delete = async (req, resp, next) =>{
    await db.Notify.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( (result) => {
        historyLogged(req.session.username,'delete notify',LogConstant.SUCCESS,req.params.id);
             
        return result;
    })
    .catch(error => {
        historyLogged(req.session.username,'delete notify',LogConstant.FAILED,error.message);
        
        return resp.status(400).json({
                status:400,
                msg : 'Fill required value to all fields'
            })
    })
}

exports.updateNotify = async (req, res, next) => {
    db.Notify.update(
        {status:0},{
        where: {
            assignToId: req.session.user_id
        }
    })
    .then((result) => {
        return res.status(200).json({
            status: 200,
            msg:'Ok'
        });
    })
    .catch((error) => {
        return res.status(400).json({
            status: 400,
            msg:error.message
        });
    });
}