const express = require("express");
const router = express.Router();
const informeFinalController = require("../controllers/informeFinalController");

router.get("/", informeFinalController.leerInformeFinal);
router.post("/", informeFinalController.crearInformeFinal);
router.put("/", informeFinalController.actualizarInformeFinal);

module.exports = router;