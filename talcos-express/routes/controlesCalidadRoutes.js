const express = require("express");
const router = express.Router();
const controlCalidadController = require("../controllers/controlCalidadController");

router.get("/", controlCalidadController.leerControlCalidad);
router.post("/", controlCalidadController.crearControlCalidad);
router.put("/", controlCalidadController.actualizarControlCalidad);

module.exports = router;