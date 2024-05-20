const db = require('../../../../../models');
const { validationResult } = require('express-validator');
const LogConstant = require("../../../Constant/log.constant");
const historyLogged = require("../../../Helper/HistoryLogged").historyLogged

exports.index = async (req, resp, next) => {
    await db.TechpackStock.findAll()
    .then((result) => {
        console.log('TechpackStock Controller',result);
        resp.render('dashboard/admin/supplier/index',{
            supplierList: result,
            pageTitle: 'Supplier'
        });        
    })
    .catch(error => {
        throw new Error(error);
    });
} 

exports.create = async(req, resp, next) =>{
   let rs=  await db.User.findAll({
        where : {
            roleId : 4
        }
      }).then ((rs) =>{
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',rs)
        resp.render('dashboard/admin/supplier/create',{
            pageTitle: 'Supplier',
            userList : rs
        });
      })
    
}

exports.edit = async (req, resp, next) =>{
    let suppliers = await db.TechpackStock.findAll()
                .then( (suppliers) =>{
                    return suppliers;
                });
    await db.TechpackStock.findByPk(req.params.id)
    .then((result) => {
        resp.render('dashboard/admin/supplier/edit',{
            supplier: result,
            supplierList: suppliers,
            pageTitle: 'Supplier'
        });  
    })
    .catch((error) => {
        throw new Error(error);
    });
}

exports.store = (req, resp, next) =>{
    db.TechpackStock.create(req.body)
    .then((result) => {
        historyLogged(req.session.username,'create supplier',LogConstant.SUCCESS, item=result.id );
            
        req.flash('success', `New Supplier added ${ req.body.name } successfully!`);
        resp.status(200).redirect('/supplier');
    })
    .catch((error) => { 
        historyLogged(req.session.username,'create supplier',LogConstant.FAILED,error.message );
            
        throw new Error(error);
    });
}

exports.update = (req, resp, next) =>{
    db.TechpackStock.update(req.body,{
        where: {
            id: req.params.id
        }
    })
    .then( result => {   
        historyLogged(req.session.username,'update supplier',LogConstant.SUCCESS,req.params.id );
                 
        req.flash('success', `Supplier updated ${ req.body.name } successfully!`)
        resp.status(200).redirect('/supplier');
    })
    .catch(error => {
         
        historyLogged(req.session.username,'update supplier',LogConstant.FAILED,error.message );
           
        throw new Error(error);
    })
}

exports.delete = async (req, resp, next) =>{
    await db.TechpackStock.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {    
        historyLogged(req.session.username,'delete supplier',LogConstant.SUCCESS ,req.params.id);
              
        req.flash('warning', `Supplier deleted successfully!`);        
        resp.status(200).redirect('/supplier');
    })
    .catch(error => {
        historyLogged(req.session.username,'delete supplier',LogConstant.FAILED,error.message );
            
        throw new Error(error);
    })
}

// -------------roles-----------------
exports.home = async (req, resp, next) =>{

    const  notification = await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id
        },
        limit : 6
    }) 
    const  count_notification = await db.Notify.findAll({
        where: {
            assignToId: req.session.user_id,
            status:1
        },
        limit : 6
    });

    const  my_store = await db.User.findByPk(id=req.session.user_id,{
        
        include: 
            {
                model: db.TechpackStock,
                as: 'stocks',
                include : [
                    {
                        model: db.Techpack,
                        as: 'techpack',
                    }, {
                        model: db.Invoice,
                        include: 
                            { 
                                model: db.User,
                                as: 'createdby'
                            }
                    }
            ]
            }       
    }).then(my_store=> {

        console.log(' my_store-before--\n',my_store);
        // console.log(' my_store----end---');
    
        
        const techpack = my_store.stocks.flatMap(st => st.techpack);
        
        const invoices = my_store.stocks.flatMap(st => st.Invoices);
        //console.log(' my_store----end---',invoices.length);
    
        let count_not = 0;
         techpack.forEach(tp=>{
            //if(tp.TechpackProcess.status==0) count_not++;

            let processList = db.TechpackProcess.findAll({
                attributes: ['id', 'duedate','duedate','status','note','type','createdAt','techpackId','stockId'],
                where: {
                    techpackId:tp.id,
                },
                include: 
                    [{
                        model: db.TechpackStock,
                        as: 'stockprocess'
                    },
                    {
                        model: db.Type
                        
                    }]
            }).then( (processList) =>{
                return processList;
            });
            tp.TechpackProcess = processList;
         })
    
        return resp.render('dashboard/layout/stock',{
            my_store,
            process:techpack,
            invoices,
            count_not,
            notification,
            count_notification
        });
    });
    

}