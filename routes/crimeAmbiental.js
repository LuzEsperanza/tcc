const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const CrimeAmbientalController = require('../controllers/crimeAmbiental-controller');

router.get('/', CrimeAmbientalController.getCrimeAmbiental);
router.post('/', CrimeAmbientalController.postCrimeAmbiental);
router.get('/:id', CrimeAmbientalController.getUmCrimeAmbiental);
router.delete('/', CrimeAmbientalController.deleteCrimeAmbiental);

module.exports = router;