const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registroController");

router.get("/", registroController.leerRegistro);
router.post("/", registroController.crearRegistro);
router.put("/", registroController.actualizarRegistro);

module.exports = router;
