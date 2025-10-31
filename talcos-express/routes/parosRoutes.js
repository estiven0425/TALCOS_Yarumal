const paroController = require("../controllers/paroController");
const express = require("express");

const router = express.Router();

router.get("/", paroController.leerParo);
router.post("/", paroController.crearParo);
router.put("/", paroController.actualizarParo);
router.put("/eliminarparo", paroController.eliminarParo);

module.exports = router;
