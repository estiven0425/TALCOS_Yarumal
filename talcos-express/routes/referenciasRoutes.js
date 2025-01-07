const express = require('express');
const router = express.Router();
const referenciaController = require('../controllers/referenciaController');

router.get('/', referenciaController.leerReferencia);
router.post('/', referenciaController.crearReferencia);
router.put('/', referenciaController.actualizarReferencia);

module.exports = router;