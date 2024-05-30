const db = require('../../../../../models');
const { validationResult, body } = require('express-validator');
const { uploadImage } = require('../../../Middleware/upload');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged;
const pushNotify = require("../../../Helper/NotifyController").store;
const ALPHABET = '0123456789QWERTYUIOPLKJHGFDSAZXCVBNM';

exports.upload = async (req, res, next) => {
    uploadImage(req, res, function (err) {
        console.log('=============img=============\n', req.files);
        if (err) {
            console.log('Something went wrong :', err);
            historyLogged(req.session.username, 'upload image techpack', LogConstant.FAILED + err);
            return res.status(400).json({
                status: 400,
                msg: err
            });
        }
        console.log('Image uploaded sucessfully');
        historyLogged(req.session.username, 'upload image techpack', LogConstant.SUCCESS);
        return res.status(200).json({
            status: 200,
            file: req.files
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
            historyLogged(req.session.username, 'load techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields'
            })
        });
}
exports.detail = async (req, resp, next) => {

    let processList = await db.TechpackProcess.findAll({
        attributes: ['id','quantity', 'fee','groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
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
                model: db.User,
                as: 'verifyby'
            },
            {
                model: db.TechpackHistory,
                as: 'history'
            }
        ]
    })
        .then((result) => {
            resp.render('dashboard/admin/techpack/detail', {
                history: result.history,
                techpack: result,
                processList,
                pageTitle: 'Techpack'
            });
        })
        .catch((error) => {
            historyLogged(req.session.username, 'load techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        });
}

exports.create = async (req, resp, next) => {
    let techpack_clone = null;
    if (req.params.id) {
        techpack_clone = await db.Techpack.findByPk(req.params.id, {
            include: [
                {
                    model: db.TechpackCategory,
                    as: 'category'
                },
                {
                    model: db.TechpackSubCategory,
                    as: 'sub_category'
                }, {
                    model: db.TechpackCloth,
                    as: 'cloth'
                }
            ]
        });
        console.log('techpack_clone', techpack_clone);
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
        techpack_clone: techpack_clone,
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
            },
            {
                model: db.User,
                as: 'verifyby'
            }
        ]
    })
        .then((result) => {
            console.log(result.verifyby)
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
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        });
}

exports.store = (req, resp, next) => {
    db.Techpack.create(req.body)
        .then((result) => {
            db.TechpackHistory.create(
                {
                    techpackId: result.id,
                    content: 'create a new techpack - ' + req.session.username
                }
            );

            historyLogged(req.session.username, 'create techpack', LogConstant.SUCCESS, item = result.id);
            pushNotify(result.createById, result.id, 'techpack has been created', type = 'techpack', req, res, next);
            req.flash('success', `New Techpack added ${req.body.name} successfully!`);
            res.status(200).redirect('/techpack');
        })
        .catch((error) => {
            historyLogged(req.session.username, 'create techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        });
}

exports.update = (req, resp, next) => {
    let content;
    if (req.body.status == 5) {
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
                    techpackId: req.params.id,
                    content
                }
            );

            historyLogged(req.session.username, 'update techpack', LogConstant.SUCCESS, req.params.id);
            pushNotify(req.body.createById, req.params.id, 'techpack has been updated', type = 'techpack', req, resp, next);

            req.flash('success', `Techpack updated successfully!`)
            resp.status(200).redirect('/techpack/edit/' + req.params.id);
        })
        .catch(error => {

            historyLogged(req.session.username, 'update techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
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
            historyLogged(req.session.username, 'delete techpack', LogConstant.SUCCESS, req.params.id);
            req.flash('warning', `Techpack deleted successfully!`);
            resp.status(200).redirect('/techpack');
        })
        .catch(error => {
            historyLogged(req.session.username, 'delete techpack', LogConstant.FAILED, error.message);

            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        })
}

exports.confirm = (req, resp, next) => {
    let content = 'the techpack has been confirmed - ' + req.session.username;

    const uId = req.body.createById;

    db.Techpack.update({ confirmById: req.session.user_id, status: 1 }, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        db.TechpackHistory.create(
            {
                techpackId: req.params.id,
                content
            }
        );
        historyLogged(req.session.username, 'confirm techpack', LogConstant.SUCCESS, req.params.id);
        pushNotify(uId, req.params.id, 'techpack has been confirm', type = 'techpack', req, resp, next);

        req.flash('success', `Techpack updated ${req.body.name} successfully!`)
        resp.status(200).redirect('/techpack/edit/' + req.params.id);
    })
        .catch(error => {

            historyLogged(req.session.username, 'confirm techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        })
}

exports.verify = (req, resp, next) => {
    let content = 'the techpack has been verified - ' + req.session.username;

    const uId = req.body.createById;

    db.Techpack.update({ verifyById: req.session.user_id, status: 4 }, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        db.TechpackHistory.create(
            {
                techpackId: req.params.id,
                content
            }
        );
        historyLogged(req.session.username, 'verified techpack', LogConstant.SUCCESS, req.params.id);
        pushNotify(uId, req.params.id, 'techpack has been verified', type = 'techpack', req, resp, next);

        req.flash('success', `Techpack updated ${req.body.name} successfully!`)
        resp.status(200).redirect('/techpack/edit/' + req.params.id);
    })
        .catch(error => {

            historyLogged(req.session.username, 'verified techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        })
}
exports.product = async(req, resp, next) => {
    const techpackId = req.body.techpackId;
    let processNotYet = await db.TechpackProcess.findAll({
        where: [{
            techpackId,
            status: {
                [db.Sequelize.Op.lt]: 4 // stt <5
            }
        }]
    });
    if (processNotYet.length!==0) {
        console.log('--------------------',processNotYet.length)
        req.flash('error', `All Status of Process must be Done before submit !`);
        resp.status(200).redirect('/techpack/process/' + techpackId);
    }
    else {
        let processTechpackDone = await db.Techpack.update(
            {
                status: 5
            }, {
            where: {
                id: techpackId
            }
        }).then(rs => {
            req.flash('success', `Status changed to compleled !`);
            resp.status(200).redirect('/techpack/process/' + techpackId);
        })
    }
}
exports.process = async (req, resp, next) => {
    let suppliers = await db.TechpackStock.findAll(
        // {
        // where: {
        //     type: 'garment_factory'
        // }
    // }
    ).then((suppliers) => {
        return suppliers;
    });

    let processList = await db.TechpackProcess.findAll({
        attributes: ['id', 'fee','groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
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

            resp.render('dashboard/admin/techpack/process', {
                supplierList: suppliers,
                techpack: result,
                processList,
                groups,
                pageTitle: 'process'
            });
        })
        .catch((error) => {
            historyLogged(req.session.username, 'load techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        });
}
exports.store_process = (req, res, next) => {
    let groupID = '0';
    const route = req.body.route;
    for (let i = 0; i < 5; i++) {
        groupID += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    //console.log(req.body.duedate)
    req.body.status = 0;
    req.body.groupID = groupID;
    db.TechpackProcess.create(req.body)
        .then((result) => {
            // db.TechpackHistory.create(
            //     {
            //         techpackId : result.id,
            //         content :'create a new process - ' + req.session.username
            //     }
            // );

            // historyLogged(req.session.username,'new process',LogConstant.SUCCESS, item=result.id );
            // pushNotify(result.createById,result.id,'techpack has been created',type='techpack',req,res,next) ;
            if(route=='addprocess') {
                req.flash('success', `New Process added successfully! Please edit and update GroupID.`);
                res.status(200).redirect('/stock/addprocess/' + req.body.techpackId);

            }
            else {
                req.flash('success', `New Process added successfully! Please edit and update GroupID.`);
                res.status(200).redirect('/techpack/process/' + req.body.techpackId);

            }
        })
        .catch((error) => {
            //historyLogged(req.session.username,'create techpack',LogConstant.FAILED,error.message );
            return res.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        });
}

exports.delete_process = async (req, resp, next) => {
    await db.TechpackHistory.destroy({
        where: {
            techpackId: req.params.id,
        },
    });
    await db.TechpackProcess.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            historyLogged(req.session.username, 'delete  process', LogConstant.SUCCESS, req.params.id);
            req.flash('warning', `Techpack process deleted successfully!`);
            resp.status(200).redirect('/techpack/process/' + req.body.techpackId);
        })
        .catch(error => {
            historyLogged(req.session.username, 'delete process', LogConstant.FAILED, error.message);

            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        })
}
exports.update_process = (req, resp, next) => {
    let content;
    const supplierCode = req.body.supplierCode;
    console.log('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',supplierCode)
    if (req.body.status == 4) {
        content = 'the techpack process has been completed - ' + req.session.username;
        req.body.completeddate = new Date();
    }
    else {
        content = 'the techpack process has been updated - ' + req.session.username;
    }
    db.TechpackProcess.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            db.TechpackHistory.create(
                {
                    techpackId: req.body.techpackId,
                    content
                }
            );

            historyLogged(req.session.username, 'update techpack', LogConstant.SUCCESS, req.body.techpackId);
            // pushNotify(req.body.createById,req.body.techpackId,'techpack has been updated',type='techpack',req,resp,next) ;
            if(supplierCode==1) {
                req.flash('success', `Techpack process updated successfully!`)
                resp.status(200).redirect('/stock/addprocess/'+req.body.techpackId);

            } else {
                req.flash('success', `Techpack process updated successfully!`)
                resp.status(200).redirect('/techpack/process/' + req.body.techpackId);

            }
        })
        .catch(error => {

            historyLogged(req.session.username, 'update techpack', LogConstant.FAILED, error.message);
            return resp.status(200).json({
                status: 200,
                msg : 'Fill required value to all fields',
                code : error.message
            })
        })
}
exports.edit_process = async (req, resp, next) => {
    let process = await db.TechpackProcess.findOne({
        attributes: ['id','fee', 'groupID', 'duedate', 'completeddate', 'status', 'note', 'type', 'createdAt', 'techpackId', 'stockId'],
        where: {
            id: req.params.id
        },
        include:
        {
            model: db.TechpackStock,
            as: 'stockprocess'
        }
    });
    console.log('*********>*>**>*>**', process)
    let typeList = await db.Type.findAll({
        where: {
            typeOf: process.stockprocess.type
        }
    });

    resp.render('dashboard/admin/techpack/process_edit', {
        process,
        typeList,
        pageTitle: 'Techpack Process Edit'
    });
}
exports.process_all_done = async (req, resp, next) => {
    const techpackId = req.body.techpackId;
    let processNotYet = await db.TechpackProcess.findAll({
        where: [{
            techpackId,
            status: {
                [db.Sequelize.Op.lt]: 4 // stt <5
            }
        }]
    });
    if (processNotYet.length!==0) {
        console.log('--------------------',processNotYet.length)
        req.flash('error', `All Status of Process must be Done before submit !`);
        resp.status(200).redirect('/techpack/process/' + techpackId);
    }
    else {
        let processTechpackDone = await db.Techpack.update(
            {
                status: 3
            }, {
            where: {
                id: techpackId
            }
        }).then(rs => {
            req.flash('success', `Status changed to Done Process(4) submit !`);
            resp.status(200).redirect('/techpack/process/' + techpackId);
        })
    }
}