const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../../../../models");

exports.index = (req, resp, next) =>{
    return resp.render('front-end/auth/register',{
        errorMessage : []
    });
}

exports.register = async (req, resp, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).render('front-end/auth/register',{
            errorMessage: errors.array()
        });
        //return resp.status(400).json({ errors: errors.array() });
    }

    await bcrypt.hash(req.body.password,12)
    .then(passwordHash => {
        db.User.create({
            name: req.body.name,
            tel: req.body.tel,
            status: 0,
            email: req.body.email,
            password: passwordHash
        })
        .then((result) => {  
                db.UserHasRole.create({
                    UserId: result.id,
                    RoleId: 2
                });
                return resp.status(200).render('front-end/auth/login',{
                    errorMessage: [{msg: 'Submit successfully!'}]
                });
        })
        .catch(error => {
            throw new Error(error);
        });       
    })
    .catch(error => {
        throw new Error(error);
    });  
}