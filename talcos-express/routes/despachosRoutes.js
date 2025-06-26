const express = require("express");
const router = express.Router();
const despachosController = require("../controllers/despachosController");

router.get("/", despachosController.leerDespachos);
router.post("/", despachosController.crearDespacho);
router.put("/", despachosController.actualizarDespacho);
router.put("/eliminardespacho", despachosController.eliminarDespacho);

module.exports = router;
