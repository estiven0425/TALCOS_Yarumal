const express = require("express");
const informeInicialController = require("../controllers/informeInicialController");

const router = express.Router();

router.get("/", informeInicialController.leerInformeInicial);
router.get(
  "/turnoinformeinicial",
  informeInicialController.turnoInformeInicial,
);
router.get(
  "/validarinformefinalpendiente",
  informeInicialController.validarInformeFinalPendiente,
);
router.post("/", informeInicialController.crearInformeInicial);
router.put("/", informeInicialController.actualizarInformeInicial);

module.exports = router;
