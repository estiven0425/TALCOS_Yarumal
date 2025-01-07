const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.leerUsuario);
router.post('/', usuarioController.crearUsuario);
router.put('/', usuarioController.actualizarUsuario);

module.exports = router;