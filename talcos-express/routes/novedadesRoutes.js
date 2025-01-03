const express = require("express");
const router = express.Router();
const novedadController = require("../controllers/novedadController");

router.get("/", novedadController.leerNovedad);
router.post("/", novedadController.crearNovedad);
router.put("/", novedadController.actualizarNovedad);

module.exports = router;