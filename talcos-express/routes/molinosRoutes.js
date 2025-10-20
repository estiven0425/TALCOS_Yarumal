const express = require("express");
const molinoController = require("../controllers/molinoController");

const router = express.Router();

router.get("/", molinoController.leerMolino);
router.post("/", molinoController.crearMolino);
router.put("/", molinoController.actualizarMolino);
router.put(
  "/actualizarhorometro",
  molinoController.actualizarHorometrosMolinos,
);
router.put("/eliminarmolino", molinoController.eliminarMolino);

module.exports = router;
