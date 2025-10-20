const despachosController = require("../controllers/despachosController");
const express = require("express");

const router = express.Router();

router.get("/", despachosController.leerDespachos);
router.get("/filtrados", despachosController.leerDespachosFiltrados);
router.post("/", despachosController.crearDespacho);
router.put("/", despachosController.actualizarDespacho);
router.put("/eliminardespacho", despachosController.eliminarDespacho);

module.exports = router;
