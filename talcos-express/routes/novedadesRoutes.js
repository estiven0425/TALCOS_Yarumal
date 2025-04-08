const express = require("express");
const router = express.Router();
const novedadController = require("../controllers/novedadController");

router.get("/", novedadController.leerNovedad);
router.get("/turnonovedad", novedadController.turnoNovedad);
router.get("/listanovedad", novedadController.listaNovedad);
router.get("/listaparonovedad", novedadController.listaParoNovedad);
router.post("/", novedadController.crearNovedad);
router.put("/", novedadController.actualizarNovedad);
router.put("/finparonovedad", novedadController.finParoNovedad);

module.exports = router;
