
const multer = require('multer');
const historyLogged = require("../../Http/Helper/HistoryLogged").historyLogged;
const LogConstant = require("../../../app/Http/Constant/log.constant")

var Storage = multer.diskStorage({

    destination: function(req, file, callback) {
        console.log('file.originalname upload',file.originalname);
        callback(null, "./public/uploads");
    },
    filename: function(req, file, callback) {
        console.log('file.originalname',file.originalname);
        let f = file.fieldname.replace(/\s/g, '_') + "_" + Date.now() + "_" + file.originalname.replace(/\//g,'-').replace(/\s/g, '_');
        historyLogged(req.session.username,'upload image '+f,LogConstant.SUCCESS);
            
        callback(null,f );
    }
});
const uploadImage = multer({

    limits: {
        fileSize: 15 * 1024 * 1024,
      },
    storage: Storage
}).array("file",3);

const uploadFileSingle = multer({
    limits: {
        fileSize: 50 * 1024 * 1024,
      },
    storage: Storage
}).array("file", 10);

module.exports.uploadImage = uploadImage;
module.exports.uploadFile  = uploadFileSingle;