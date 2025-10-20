const express = require("express");
const referenciaController = require("../controllers/referenciaController");

const router = express.Router();

router.get("/", referenciaController.leerReferencia);
router.post("/", referenciaController.crearReferencia);
router.put("/", referenciaController.actualizarReferencia);
router.put(
  "/actualizarcantidad",
  referenciaController.actualizarCantidadesReferencias,
);
router.put("/eliminarreferencia", referenciaController.eliminarReferencia);

module.exports = router;
