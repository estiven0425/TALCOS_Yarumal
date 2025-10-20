const bultoController = require("../controllers/bultoController");
const express = require("express");

const router = express.Router();

router.get("/", bultoController.leerBulto);
router.post("/", bultoController.crearBulto);
router.put("/", bultoController.actualizarBulto);
router.put("/eliminarbulto", bultoController.eliminarBulto);

module.exports = router;
