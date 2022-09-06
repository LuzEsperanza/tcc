const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const BuscaController = require('../controllers/busca-controller');

router.get('/', login.atendente, BuscaController.getBusca);

module.exports = router;