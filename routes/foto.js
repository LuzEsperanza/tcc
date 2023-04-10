const express = require('express');
const router = express.Router();

const mysql = require('../mysql').pool;
const multer = require('multer');


const storage = multer.diskStorage({ 
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, Date.now() + file.originalname.trim())
    }
});

// const fileFilter = (req, file, cb) =>{
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null, true);

//     }else{
//         cb(null, false);
//     }


// }

const upload = multer({
    storage : storage,
    // fileFilter : fileFilter
});
// const upload = multer({ dest: 'uploads/' });


const login = require('../middleware/login');

const FotoController = require('../controllers/foto-controller');

router.get('/', login.obrigatorio, FotoController.getFoto);

router.post('/', login.obrigatorio,  upload.array('images'), FotoController.postFoto);

router.get('/:id', FotoController.getUmaFoto);

router.patch('/',login.obrigatorio, upload.single('foto_imagem'), FotoController.pathFoto);

router.delete('/', login.obrigatorio, FotoController.deleteFoto);

module.exports = router;
