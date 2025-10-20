const express = require("express");
const productoRechazadoController = require("../controllers/productoRechazadoController");

const router = express.Router();

router.get("/", productoRechazadoController.leerProductoRechazado);
router.post("/", productoRechazadoController.crearProductoRechazado);
router.put("/", productoRechazadoController.actualizarProductoRechazado);
router.put(
  "/reasignarproductorechazado",
  productoRechazadoController.reasignarProductoRechazado,
);
router.put(
  "/eliminarproductorechazado",
  productoRechazadoController.eliminarProductoRechazado,
);

module.exports = router;
