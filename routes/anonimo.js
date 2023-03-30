const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


const AnonimoController = require('../controllers/anonimo-controller');

router.post('/',  AnonimoController.anonimo);

module.exports = router;