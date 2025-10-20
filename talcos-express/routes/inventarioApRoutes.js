const express = require("express");
const inventarioApController = require("../controllers/inventarioApController");

const router = express.Router();

router.get("/", inventarioApController.leerInventarioAp);
router.post("/", inventarioApController.crearInventarioAp);
router.put("/", inventarioApController.actualizarInventarioAp);
router.put(
  "/actualizarcantidad",
  inventarioApController.actualizarCantidadesInventarioAp,
);
router.put(
  "/eliminarinventarioap",
  inventarioApController.eliminarInventarioAp,
);

module.exports = router;
