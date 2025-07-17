const express = require("express");
const router = express.Router();
const despachoComercialController = require("../controllers/despachoComercialController");

router.get("/", despachoComercialController.leerDespachoComercial);
router.get(
  "/filtrados",
  despachoComercialController.leerDespachosComercialesFiltrados,
);
router.post("/", despachoComercialController.crearDespachoComercial);
router.put("/", despachoComercialController.actualizarDespachoComercial);
router.put(
  "/eliminardespachocomercial",
  despachoComercialController.eliminarDespachoComercial,
);

module.exports = router;
