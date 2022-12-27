const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');

const DenunciaController = require('../controllers/denuncia-controller');

router.get('/:denunciante', DenunciaController.getDenuncia);

router.post('/', DenunciaController.postDenuncia);

router.get('/:id', login.atendente, DenunciaController.getUmaDenuncia);

router.patch('/', login.atendente, DenunciaController.pathDenuncia);

router.delete('/', login.obrigatorio, DenunciaController.deleteDenuncia);



module.exports = router;
