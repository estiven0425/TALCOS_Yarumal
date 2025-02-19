const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perfilController");

router.get("/", perfilController.leerPerfil);
router.get("/personalperfil", perfilController.personalPerfil);
router.post("/", perfilController.crearPerfil);
router.put("/", perfilController.actualizarPerfil);

module.exports = router;
