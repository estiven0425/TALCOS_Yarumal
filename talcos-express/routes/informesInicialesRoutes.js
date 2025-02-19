const express = require("express");
const router = express.Router();
const informeInicialController = require("../controllers/informeInicialController");

router.get("/", informeInicialController.leerInformeInicial);
router.get(
  "/turnoinformeinicial",
  informeInicialController.turnoInformeInicial
);
router.post("/", informeInicialController.crearInformeInicial);
router.put("/", informeInicialController.actualizarInformeInicial);

module.exports = router;
