const express = require("express");
const perfilController = require("../controllers/perfilController");

const router = express.Router();

router.get("/", perfilController.leerPerfil);
router.get("/personalperfil", perfilController.personalPerfil);
router.get("/conteoperfil", perfilController.conteoPerfil);
router.post("/", perfilController.crearPerfil);
router.put("/", perfilController.actualizarPerfil);
router.put("/eliminarperfil", perfilController.eliminarPerfil);

module.exports = router;
