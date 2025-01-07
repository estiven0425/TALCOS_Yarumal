const express = require('express');
const router = express.Router();
const bobCatController = require('../controllers/bobCatController');

router.get('/', bobCatController.leerBobCat);
router.post('/', bobCatController.crearBobCat);
router.put('/', bobCatController.actualizarBobCat);

module.exports = router;