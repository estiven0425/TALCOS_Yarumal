const express = require("express");
const materiaPrimaController = require("../controllers/materiaPrimaController");

const router = express.Router();

router.get("/", materiaPrimaController.leerMateriaPrima);
router.post("/", materiaPrimaController.crearMateriaPrima);
router.put("/", materiaPrimaController.actualizarMateriaPrima);
router.put(
  "/eliminarmateriaprima",
  materiaPrimaController.eliminarMateriaPrima,
);

module.exports = router;
