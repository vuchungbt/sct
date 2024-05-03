const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const { uploadImage } = require('../../../Middleware/upload');

exports.upload = async (req, res, next) => {
    uploadImage(req, res, function(err) {
        console.log('=============img=============\n',req.files);
        if (err) {
            console.log('Something went wrong :',err);
            return res.status(400).json({
                status: 400,
                msg:err
            });
        }
        console.log('Image uploaded sucessfully');
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
                model: db.TechpackCategory,
                as: 'sub_category'
            }]
    })
        .then((result) => {
            console.log('Techpack Controller', result);
            resp.render('dashboard/admin/techpack/index', {
                techpackList: result,
                pageTitle: 'Techpack'
            });
        })
        .catch(error => {
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
                model: db.TechpackCategory,
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
            resp.render('dashboard/admin/techpack/detail', {
                techpack: result,
                pageTitle: 'Techpack'
            });
        })
        .catch((error) => {
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
                    model: db.TechpackCategory,
                    as: 'sub_category'
                },{
                    model: db.TechpackCloth,
                    as: 'cloth'
                }
            ]
        });
        console.log('techpack_clone',techpack_clone);
    }

    let categories = await db.TechpackCategory.findAll({
        where: {
            type: 'category'
        }
    });
    let sub_categories = await db.TechpackCategory.findAll({
        where: {
            type: 'sub-category'
        }
    });
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
    let categories = await db.TechpackCategory.findAll({
        where: {
            type: 'category'
        }
    });
    let sub_categories = await db.TechpackCategory.findAll({
        where: {
            type: 'sub-category'
        }
    });
    let cloth = await db.TechpackCloth.findAll();
    let users = await db.User.findAll();
    
    await db.Techpack.findByPk(req.params.id, {
        include: [
            {
                model: db.TechpackCategory,
                as: 'category'
            },
            {
                model: db.TechpackCategory,
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
        .then(() => {
            req.flash('success', `New Techpack added ${req.body.name} successfully!`);
            res.status(200).redirect('/techpack');
        })
        .catch((error) => {
            throw new Error(error);
        });
}

exports.update = (req, resp, next) => {
    db.Techpack.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            req.flash('success', `Techpack updated ${req.body.name} successfully!`)
            resp.status(200).redirect('/techpack');
        })
        .catch(error => {
            throw new Error(error);
        })
}

exports.delete = async (req, resp, next) => {
    await db.Techpack.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            req.flash('warning', `Techpack deleted successfully!`);
            resp.status(200).redirect('/techpack');
        })
        .catch(error => {
            throw new Error(error);
        })
}