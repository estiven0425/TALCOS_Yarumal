const express = require("express");
const turnoController = require("../controllers/turnoController");

const router = express.Router();

router.get("/", turnoController.leerTurno);
router.post("/", turnoController.crearTurno);
router.put("/", turnoController.actualizarTurno);
router.put("/eliminarturno", turnoController.eliminarTurno);

module.exports = router;
