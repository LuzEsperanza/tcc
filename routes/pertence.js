const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const PertenceController = require('../controllers/pertence-controller');



router.post('/',  PertenceController.postPertence);

module.exports = router;