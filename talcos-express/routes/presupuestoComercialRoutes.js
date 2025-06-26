const express = require("express");
const router = express.Router();
const presupuestoComercialController = require("../controllers/presupuestoComercialController");

router.get("/", presupuestoComercialController.leerPresupuestoComercial);
router.post("/", presupuestoComercialController.crearPresupuestoComercial);
router.put("/", presupuestoComercialController.actualizarPresupuestoComercial);
router.put(
  "/eliminarpresupuestocomercial",
  presupuestoComercialController.eliminarPresupuestoComercial
);

module.exports = router;
