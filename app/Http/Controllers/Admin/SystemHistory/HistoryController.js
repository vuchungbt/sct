const db = require('../../../../../models');
const { validationResult } = require('express-validator');

exports.index = async (req, resp, next) => {
    await db.SystemHistory.findAll()
    .then((result) => {
        console.log('SystemHistory Controller',result);
        resp.render('dashboard/admin/history/index',{
            historyList: result.reverse(),
            pageTitle: 'SystemHistory'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 