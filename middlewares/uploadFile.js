var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    } 
});

exports.uploadImage = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        console.log(file);
        if(file.originalname.match(/\.(bmp|jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only images are allowed!'));
        }
    }
});