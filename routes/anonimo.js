const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AnonimoController = require('../controllers/anonimo-controller');

router.post('/',  AnonimoController.anonimo);

module.exports = router;