const express = require("express");
const molinoApController = require("../controllers/molinoApController");

const router = express.Router();

router.get("/", molinoApController.leerMolinoAp);
router.post("/", molinoApController.crearMolinoAp);
router.put("/", molinoApController.actualizarMolinoAp);
router.put(
  "/actualizarhorometro",
  molinoApController.actualizarHorometrosMolinosAp,
);
router.put("/eliminarmolino", molinoApController.eliminarMolinoAp);

module.exports = router;
