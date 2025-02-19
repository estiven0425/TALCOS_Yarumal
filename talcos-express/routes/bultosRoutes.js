const express = require("express");
const router = express.Router();
const bultoController = require("../controllers/bultoController");

router.get("/", bultoController.leerBulto);
router.post("/", bultoController.crearBulto);
router.put("/", bultoController.actualizarBulto);

module.exports = router;
