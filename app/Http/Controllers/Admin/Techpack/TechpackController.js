const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const { uploadImage } = require('../../../Middleware/upload');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged ;
const pushNotify = require("../../../Helper/NotifyController").store ;

exports.upload = async (req, res, next) => {
    uploadImage(req, res, function(err) {
        console.log('=============img=============\n',req.files);
        if (err) {
            console.log('Something went wrong :',err);
            historyLogged(req.session.username,'upload image techpack',LogConstant.FAILED + err);
            return res.status(400).json({
                status: 400,
                msg:err
            });
        }
        console.log('Image uploaded sucessfully');
        historyLogged(req.session.username,'upload image techpack',LogConstant.SUCCESS );
        return res.status(200).json({
            status: 200,
            file:req.files
        });
    });
}
exports.index = async (req, resp, next) => {
    await db.Techpack.findAll({
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
            console.log('Techpack Controller', result);
            resp.render('dashboard/admin/techpack/index', {
                techpackList: result,
                userId: req.session.user_id,
                pageTitle: 'Techpack'
            });
        })
        .catch(error => {
            historyLogged(req.session.username,'load techpack',LogConstant.FAILED,error.message );
            throw new Error(error.message);
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
            resp.render('dashboard/admin/techpack/detail', {
                history:result.history,
                techpack: result,
                pageTitle: 'Techpack'
            });
        })
        .catch((error) => {
            historyLogged(req.session.username,'load techpack',LogConstant.FAILED,error.message );
            throw new Error(error);
        });
}

exports.create = async (req, resp, next) => {
    let techpack_clone =null;
    if (req.params.id ) {
        techpack_clone = await db.Techpack.findByPk(req.params.id , {
            include: [
                {
                    model: db.TechpackCategory,
                    as: 'category'
                },
                {
                    model: db.TechpackSubCategory,
                    as: 'sub_category'
                },{
                    model: db.TechpackCloth,
                    as: 'cloth'
                }
            ]
        });
        console.log('techpack_clone',techpack_clone);
    }

    let categories = await db.TechpackCategory.findAll();
    let sub_categories = await db.TechpackSubCategory.findAll();
    let cloth = await db.TechpackCloth.findAll();
    let users = await db.User.findAll();
            
    resp.render('dashboard/admin/techpack/create', {
        categoriesList: categories,
        sub_categoriesList: sub_categories,
        clothList: cloth,
        usersList: users,
        techpack_clone : techpack_clone,
        pageTitle: 'Techpack'
    });
}

exports.edit = async (req, resp, next) => {
    let categories = await db.TechpackCategory.findAll();
    let sub_categories = await db.TechpackSubCategory.findAll();
    let cloth = await db.TechpackCloth.findAll();
    let users = await db.User.findAll();
    
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
            }
        ]
    })
        .then((result) => {
            
            resp.render('dashboard/admin/techpack/edit', {
                techpack: result,
                categoriesList: categories,
                sub_categoriesList: sub_categories,
                clothList: cloth,
                usersList: users,
                pageTitle: 'Techpack'
            });
        })
        .catch((error) => {
            throw new Error(error);
        });
}

exports.store = (req, res, next) => {
    db.Techpack.create(req.body)
        .then((result) => {
            db.TechpackHistory.create(
                {
                    techpackId : result.id,
                    content :'create a new techpack - ' + req.session.username
                }
            );
            
            historyLogged(req.session.username,'create techpack',LogConstant.SUCCESS, item=result.id );
            pushNotify(result.createById,result.id,'techpack has been created',type='techpack',req,res,next) ;
            req.flash('success', `New Techpack added ${req.body.name} successfully!`);
            res.status(200).redirect('/techpack');
        })
        .catch((error) => {
            historyLogged(req.session.username,'create techpack',LogConstant.FAILED,error.message );
            throw new Error(error);
        });
}

exports.update = (req, resp, next) => {
    let content;
    if(req.body.status==3) {
        content = 'the techpack has been completed - ' + req.session.username;
    }
    else {
        content = 'the techpack has been updated - ' + req.session.username;
    }
    db.Techpack.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            db.TechpackHistory.create(
                {
                    techpackId :  req.params.id,
                    content 
                }
            );
            
            historyLogged(req.session.username,'update techpack',LogConstant.SUCCESS,req.params.id );
            pushNotify(req.body.createById,req.params.id,'techpack has been updated',type='techpack',req,resp,next) ;
            
            req.flash('success', `Techpack updated successfully!`)
            resp.status(200).redirect('/techpack/edit/'+req.params.id);
        })
        .catch(error => {
            
            historyLogged(req.session.username,'update techpack',LogConstant.FAILED,error.message );
            throw new Error(error);
        })
}

exports.delete = async (req, resp, next) => {
    await db.TechpackHistory.destroy({
        where: {
          techpackId: req.params.id,
        },
      });
    await db.Techpack.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            historyLogged(req.session.username,'delete techpack',LogConstant.SUCCESS ,req.params.id);
            req.flash('warning', `Techpack deleted successfully!`);
            resp.status(200).redirect('/techpack');
        })
        .catch(error => {
            historyLogged(req.session.username,'delete supplier',LogConstant.FAILED,error.message );
          
            throw new Error(error);
        })
}

exports.confirm = (req, resp, next) => {
    let  content = 'the techpack has been confirmed - ' + req.session.username;

    const uId = req.body.createById;

    db.Techpack.update({confirmById:req.session.user_id ,status : 1}, {
        where: {
            id: req.params.id
        }
    }).then(result => {
            db.TechpackHistory.create(
                {
                    techpackId :  req.params.id,
                    content 
                }
            );
            historyLogged(req.session.username,'confirm techpack',LogConstant.SUCCESS,req.params.id );
            pushNotify(uId,req.params.id,'techpack has been confirm',type='techpack',req,resp,next) ;
            
            req.flash('success', `Techpack updated ${req.body.name} successfully!`)
            resp.status(200).redirect('/techpack/edit/'+req.params.id);
        })
        .catch(error => {
            
            historyLogged(req.session.username,'confirm techpack',LogConstant.FAILED,error.message );
            throw new Error(error);
        })
}

exports.process = async (req, resp, next) => {
    let suppliers = await db.TechpackStock.findAll({
        where: {
            type:'garment_factory'
        }
    }).then( (suppliers) =>{
        return suppliers;
    });
    await db.Techpack.findByPk(req.params.id)
        .then((result) => {
            resp.render('dashboard/admin/techpack/process', {
                supplierList:suppliers,
                techpack:result,
                processList: null,
                pageTitle: 'process'
            });
        })
        .catch((error) => {
            historyLogged(req.session.username,'load techpack',LogConstant.FAILED,error.message );
            throw new Error(error);
        });
}