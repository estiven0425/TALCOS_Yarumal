const controlCalidadController = require("../controllers/controlCalidadController");
const express = require("express");

const router = express.Router();

router.get("/", controlCalidadController.leerControlCalidad);
router.post("/", controlCalidadController.crearControlCalidad);
router.put("/", controlCalidadController.actualizarControlCalidad);

module.exports = router;
