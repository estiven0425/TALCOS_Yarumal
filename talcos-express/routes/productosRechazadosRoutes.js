const express = require("express");
const router = express.Router();
const productoRechazadoController = require("../controllers/productoRechazadoController");

router.get("/", productoRechazadoController.leerProductoRechazado);
router.post("/", productoRechazadoController.crearProductoRechazado);
router.put("/", productoRechazadoController.actualizarProductoRechazado);
router.put(
  "/eliminarproductorechazado",
  productoRechazadoController.eliminarProductoRechazado
);

module.exports = router;
