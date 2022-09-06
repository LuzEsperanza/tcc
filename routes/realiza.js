const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const RealizaController = require('../controllers/realiza-controller');

router.get('/', login.obrigatorio, RealizaController.getRealiza);

router.post('/:id_denuncia', login.obrigatorio, RealizaController.postRealiza);

module.exports = router;
