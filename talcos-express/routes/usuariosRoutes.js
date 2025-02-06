const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.leerUsuario);
router.get('/personalusuario', usuarioController.personalUsuario);
router.post('/', usuarioController.crearUsuario);
router.put('/', usuarioController.actualizarUsuario);
router.put('/eliminarusuario', usuarioController.eliminarUsuario);

module.exports = router;