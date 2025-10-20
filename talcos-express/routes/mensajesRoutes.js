const express = require("express");
const mensajeController = require("../controllers/mensajeController");

const router = express.Router();

router.get("/", mensajeController.leerMensaje);
router.get("/notificacionmensaje", mensajeController.notificacionMensaje);
router.post("/", mensajeController.crearMensaje);
router.put("/", mensajeController.actualizarMensaje);

module.exports = router;
