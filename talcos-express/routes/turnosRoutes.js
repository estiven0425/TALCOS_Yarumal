const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

router.get('/', turnoController.leerTurno);
router.post('/', turnoController.crearTurno);
router.put('/', turnoController.actualizarTurno);

module.exports = router;