const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


const AnonimoController = require('../controllers/anonimo-controller');

router.post('/',  AnonimoController.anonimo);
router.post('/login', AnonimoController.loginAnonimo);
module.exports = router;