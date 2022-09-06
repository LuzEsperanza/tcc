const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');

const DenuncianteController = require('../controllers/denunciante-controller');

router.get('/', DenuncianteController.getDenunciante);

router.post('/cadastro', DenuncianteController.postDenunciante);

router.get('/:denuncianteID', login.obrigatorio, DenuncianteController.getUmDenunciante);

router.patch('/', login.obrigatorio, DenuncianteController.patchDenunciante);

router.delete('/', login.obrigatorio, DenuncianteController.deleteDenunciante);

router.post('/login', DenuncianteController.loginDenunciante);

module.exports = router;
