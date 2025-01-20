const express = require('express');
const router = express.Router();
const informeFinalController = require('../controllers/informeFinalController');

router.get('/', informeFinalController.leerInformeFinal);
router.get('/turnoinformefinal', informeFinalController.turnoInformeFinal);
router.post('/', informeFinalController.crearInformeFinal);
router.put('/', informeFinalController.actualizarInformeFinal);

module.exports = router;