const express = require("express");
const presupuestoComercialController = require("../controllers/presupuestoComercialController");

const router = express.Router();

router.get("/", presupuestoComercialController.leerPresupuestoComercial);
router.post("/", presupuestoComercialController.crearPresupuestoComercial);
router.put("/", presupuestoComercialController.actualizarPresupuestoComercial);
router.put(
  "/eliminarpresupuestocomercial",
  presupuestoComercialController.eliminarPresupuestoComercial,
);

module.exports = router;
