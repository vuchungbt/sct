const jwt = require('jsonwebtoken');
const db = require('../../../models');


module.exports = async (req,resp,next) => {
    let accessToken = req.cookies.jwt;
    if(!accessToken || !req.session.email){
        await req.session.destroy();
        await resp.clearCookie("jwt");
        await resp.clearCookie("my-session-name");
        await resp.clearCookie("connect.sid");
        return resp.redirect('/login');
    }

    try {
        let isAuth = jwt.verify(accessToken,'longest secreate key node admin');
        console.log('>>-->isAuth',isAuth);

        if(!isAuth.auth){
            return resp.redirect('/login');    
        }
    
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
        req.notification = notification,
        req.count_notification=count_notification

        next();    
    } catch (error) {
        await req.session.destroy();
        await resp.clearCookie("jwt");
        await resp.clearCookie("my-session-name");
        await resp.clearCookie("connect.sid");
        return resp.redirect('/login');
        //return resp.status(400).send('Invalid token !');
    }  
}