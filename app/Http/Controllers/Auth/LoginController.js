const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../../../../models");
const LogConstant = require("../../../../app/Http/Constant/log.constant");
const historyLogged = require("../../../../app/Http/Helper/HistoryLogged").historyLogged;


exports.index = (req, resp, next) =>{
    return resp.render('front-end/auth/login',{
        errorMessage: []
    });
}

exports.login = async (req,resp,next) => {  
    await db.User.findOne({
        where:{
            email: req.body.email
        },
        include: {
            model: db.Role
        }
    })
    .then(user =>{         
        if(!user){
            return resp.status(422).render('front-end/auth/login',{
                errorMessage: [{msg: 'User not found. Please sign up!'}]
            });
        } else if(user.status==0) {
            return resp.status(403).render('front-end/auth/login',{
                errorMessage: [{msg: 'Account deactive . Please contact to admin!'}]
            });
        }
        let roles = user.Role.name;
        bcrypt.compare(req.body.password, user.password)
        .then(result =>{
            if(!result){
                return resp.status(422).render('front-end/auth/login',{
                    errorMessage: [{msg: 'Invalid Credentials'}]
                });
            }
            req.session.username = user.name;
            req.session.email = user.email;
            req.session.user_id = user.id;
            req.session.auth = true;
            req.session.roles = roles;
           
            

            let payload = {
                auth: true,
                name: user.name,
                email: user.email

            };
           
            let accessToken = jwt.sign(payload, 'longest secreate key node admin', {
                algorithm: "HS256",
                expiresIn: '10h'
            });
        
            // console.log("accessToken",accessToken);
            
            resp.cookie("jwt", accessToken, {secure: true, httpOnly: true/*, samesite:"lax"*/});
            historyLogged(req.session.username,'login',LogConstant.SUCCESS);
            return resp.redirect('/home');
        })
    })
    .catch(error => {
        historyLogged(req.body.email,'login',LogConstant.FAILED,error.message);
        throw new Error(error);
    });    
}

exports.logout = async (req,resp,next) => { 
    historyLogged(req.session.username,'logout',LogConstant.SUCCESS);
    await req.session.destroy();
    await resp.clearCookie("jwt");
    await resp.clearCookie("my-session-name");
    await resp.clearCookie("connect.sid");
    return resp.redirect("/login");
}
