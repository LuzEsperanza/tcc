const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const AnalisaController = require('../controllers/analisa-controller');

router.post('/:id_denuncia', login.atendente, AnalisaController.postAnalisa);

module.exports = router;