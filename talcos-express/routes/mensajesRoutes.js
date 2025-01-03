const express = require("express");
const router = express.Router();
const mensajeController = require("../controllers/mensajeController");

router.get("/", mensajeController.leerMensaje);
router.post("/", mensajeController.crearMensaje);
router.put("/", mensajeController.actualizarMensaje);

module.exports = router;