const express = require("express");
const informeFinalController = require("../controllers/informeFinalController");

const router = express.Router();

router.get("/", informeFinalController.leerInformeFinal);
router.get("/turnoinformefinal", informeFinalController.turnoInformeFinal);
router.get(
  "/obtenerultimoinformeinicialpendiente",
  informeFinalController.obtenerUltimoInformeInicialPendiente,
);
router.post("/", informeFinalController.crearInformeFinal);
router.put("/", informeFinalController.actualizarInformeFinal);

module.exports = router;
