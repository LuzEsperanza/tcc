const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');


const storage = multer.diskStorage({ 
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);

    }else{
        cb(null, false);
    }


}

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
});

const login = require('../middleware/login');

const FotoController = require('../controllers/foto-controller');

router.get('/', FotoController.getFoto);

router.post('/', upload.single('foto_imagem'), FotoController.postFoto);

router.get('/:id', FotoController.getUmaFoto);

router.patch('/', upload.single('foto_imagem'), FotoController.pathFoto);

router.delete('/', login.obrigatorio, FotoController.deleteFoto);

module.exports = router;
