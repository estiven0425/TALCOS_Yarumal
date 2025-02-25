const express = require("express");
const router = express.Router();
const materiaPrimaController = require("../controllers/materiaPrimaController");

router.get("/", materiaPrimaController.leerMateriaPrima);
router.post("/", materiaPrimaController.crearMateriaPrima);
router.put("/", materiaPrimaController.actualizarMateriaPrima);
router.put(
  "/eliminarmateriaprima",
  materiaPrimaController.eliminarMateriaPrima
);

module.exports = router;
