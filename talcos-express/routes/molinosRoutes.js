const express = require('express');
const router = express.Router();
const molinoController = require('../controllers/molinoController');

router.get('/', molinoController.leerMolino);
router.post('/', molinoController.crearMolino);
router.put('/', molinoController.actualizarMolino);

module.exports = router;