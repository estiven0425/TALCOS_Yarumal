const express = require("express");
const router = express.Router();
const inventarioApController = require("../controllers/inventarioApController");

router.get("/", inventarioApController.leerInventarioAp);
router.post("/", inventarioApController.crearInventarioAp);
router.put("/", inventarioApController.actualizarInventarioAp);
router.put(
  "/actualizarcantidad",
  inventarioApController.actualizarCantidadesInventarioAp
);
router.put(
  "/eliminarinventarioap",
  inventarioApController.eliminarInventarioAp
);

module.exports = router;
